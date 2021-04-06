#!/bin/bash

source "${PWD}/.env"

operationMode="$@"

displayHelp() {
  echo
  echo "Usage: `basename $0` build: Builds all the component images required for btcreader."
  echo "Usage: `basename $0` run: Runs and spawns up containers for btcreader."
  echo "Usage: `basename $0` stop: Stops containers for btcreader."
  echo "Usage: `basename $0` dbdump: Makes a dump of the data from the database in btcreader."
  echo "Usage: `basename $0` restart: Restarts docker containers defined by btcreader.yaml."
  echo "Usage: `basename $0` clean: Stops and removes docker containers defined by btcreader.yaml."
  echo "Usage: `basename $0` clean_all: Stops, removes docker containers and any other items spawned by docker-compose includeing docker images."
  echo "Usage: `basename $0` reset: (Only can be used in running containers). Runs a clean_all operation, rebuilds images and spawns containers."
  echo "A combination of modes can be used, eg `basename $0` build run"
  echo
  exit 0
}

if [ "$1" == "" ] || [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
  displayHelp
fi

build() {
	echo "BUILD"
	cp .env backend/.env
	cp .env frontend/.env
	cp .env swagger-ui/.env
	docker-compose --file btcreader.yaml build
	docker inspect -f '{{.Id}}' ${BACKEND_IMAGE_NAME}:${VER_NUM} > .backend.built
	docker inspect -f '{{.Id}}' ${FRONTEND_IMAGE_NAME}:${VER_NUM} > .frontend.built
	docker inspect -f '{{.Id}}' ${DB_IMAGE_NAME}:${VER_NUM} > .db.built
	docker inspect -f '{{.Id}}' ${SWAGGER_UI_IMAGE_NAME}:${VER_NUM} > .swaggerui.built
	rm backend/.env
	rm frontend/.env
	rm swagger-ui/.env
}

	
run() { 
	echo "RUN"
	docker-compose --file btcreader.yaml up -d
}

stop() {
	echo "STOP"
	docker-compose --file btcreader.yaml stop
}


dbdump() {
	echo "DBDUMP"
	docker exec ${DB_CONTAINER_NAME} pg_dump -U ${DB_USER} --column-inserts --data-only --table=${DB_TABLENAME} ${DB_DATABASE} -f /sqlexport/btcusd-data.sql
	docker cp ${DB_CONTAINER_NAME}:/sqlexport/btcusd-data.sql database/sqlexport/btcusd-data.sql
}

restart() { 
	echo "RESTART"
	docker-compose --file btcreader.yaml restart
}

clean() {
	echo "CLEAN"
	stop
	docker-compose --file btcreader.yaml rm --force
}

clean_all() {
	echo "CLEAN ALL"
	clean
	docker rmi `docker image ls -f 'reference=${BACKEND_IMAGE_NAME}:${VER_NUM}' -q`
	docker rmi `docker image ls -f 'reference=${FRONTEND_IMAGE_NAME}:${VER_NUM}' -q`
	docker rmi `docker image ls -f 'reference=${DB_IMAGE_NAME}:${VER_NUM}' -q`
	docker rmi `docker image ls -f 'reference=${SWAGGER_UI_IMAGE_NAME}:${VER_NUM}' -q`
	docker network prune -f
	docker volume prune -f
	rm -f .backend.built .frontend.built .db.built .swaggerui.built
}

reset() {
	echo "RESET"
	clean_all
	build
	run
} 

# echo "operation = $@"
for arg; do
  if [ "$arg" == "build" ] ; then
    build
 
  elif [ "$arg" == "run" ] ; then
    run
  
  elif [ "$arg" == "stop" ] ; then
    stop
  
  elif [ "$arg" == "dbdump" ] ; then
    dbdump
    
  elif [ "$arg" == "restart" ] ; then
    restart
   
  elif [ "$arg" == "clean" ] ; then
    clean

  elif [ "$arg" == "clean_all" ] ; then
    clean_all
   
  elif [ "$arg" == "reset" ] ; then
    reset

  else
    echo "invalid option specified"
    displayHelp
  fi

done