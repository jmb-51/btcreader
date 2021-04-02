include $(HOME)/jmb-portfolio/development/workspace/btcreader/backend/.env

.PHONY : all build run stop clean clean_all re

build:
	docker build -t $(IMAGE_NAME):$(VER_NUM) .
	docker inspect -f '{{.Id}}' $(IMAGE_NAME):$(VER_NUM) > .built

run: 
	docker-compose --file backend.yaml up -d

stop:
	docker-compose --file backend.yaml stop

restart: 
	docker-compose --file backend.yaml restart

clean: stop
	docker-compose --file backend.yaml rm --force
	
clean_all: clean
	docker rmi `docker image ls -f 'reference=$(IMAGE_NAME):$(VER_NUM)' -q`
	rm -f .built

reset: clean_all build run