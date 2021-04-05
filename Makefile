include $(shell pwd)/.env

.PHONY : all build run stop dbdump clean clean_all re

build:
	cp .env backend/.env
	cp .env frontend/.env
	docker-compose --file btcreader.yaml build
	docker inspect -f '{{.Id}}' $(BACKEND_IMAGE_NAME):$(VER_NUM) > .backend.built
	docker inspect -f '{{.Id}}' $(FRONTEND_IMAGE_NAME):$(VER_NUM) > .frontend.built
	docker inspect -f '{{.Id}}' $(DB_IMAGE_NAME):$(VER_NUM) > .db.built
	rm backend/.env
	rm frontend/.env
	
run: 
	docker-compose --file btcreader.yaml up -d

stop:
	docker-compose --file btcreader.yaml stop

dbdump:
	docker exec $(DB_CONTAINER_NAME) pg_dump -U $(DB_USER) --column-inserts --data-only --table=$(DB_TABLENAME) $(DB_DATABASE) -f /sqlexport/btcusd-data.sql
	docker cp $(DB_CONTAINER_NAME):/sqlexport/btcusd-data.sql database/sqlexport/btcusd-data.sql

restart: 
	docker-compose --file btcreader.yaml restart

clean: stop
	docker-compose --file btcreader.yaml rm --force
	
clean_all: clean
	docker rmi `docker image ls -f 'reference=$(BACKEND_IMAGE_NAME):$(VER_NUM)' -q`
	docker rmi `docker image ls -f 'reference=$(FRONTEND_IMAGE_NAME):$(VER_NUM)' -q`
	docker rmi `docker image ls -f 'reference=$(DB_IMAGE_NAME):$(VER_NUM)' -q`
	docker network prune -f
	docker volume prune -f
	rm -f .backend.built .frontend.built .db.built

reset: clean_all build run