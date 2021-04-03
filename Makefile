include $(HOME)/jmb-portfolio/development/workspace/btcreader/.env

.PHONY : all build run stop clean clean_all re

build:
	docker-compose --file btcreader.yaml build
	docker inspect -f '{{.Id}}' $(BACKEND_IMAGE_NAME):$(VER_NUM) > .backend.built
	docker inspect -f '{{.Id}}' $(DB_IMAGE_NAME):$(VER_NUM) > .db.built

run: 
	docker-compose --file btcreader.yaml up -d

stop:
	docker-compose --file btcreader.yaml stop

restart: 
	docker-compose --file btcreader.yaml restart

clean: stop
	docker-compose --file btcreader.yaml rm --force
	
clean_all: clean
	docker rmi `docker image ls -f 'reference=$(BACKEND_IMAGE_NAME):$(VER_NUM)' -q`
	docker rmi `docker image ls -f 'reference=$(DB_IMAGE_NAME):$(VER_NUM)' -q`
	docker network prune -f
	docker volume prune -f
	rm -f .backend.built .db.built

reset: clean_all build run
