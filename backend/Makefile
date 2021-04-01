include $(HOME)/jmb-portfolio/development/workspace/btcreader/backend/.env

.PHONY : all build run stop clean clean_all re

build:
	docker build -t $(IMAGE_NAME):$(VER_NUM) .
	docker inspect -f '{{.Id}}' $(IMAGE_NAME):$(VER_NUM) > .built

run: build
	docker-compose --file backend.yaml up -d

stop:
	docker-compose --file backend.yaml stop

restart: build
	docker-compose --file backend.yaml restart

clean: stop
	docker-compose --file backend.yaml rm --force

reset: clean
	docker-compose --file backend.yaml up -d

clean_all: clean
	rm -f .built
