FROM swaggerapi/swagger-ui:latest 

ARG backend_api

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

# Create app directory on docker
WORKDIR /swaggerdoc

# copy dotenv file to docker image
COPY .env ./

# copy files to docker image
COPY swaggerdoc/btcreader-swagger.json ./
# replace mockup api value with ip address of server
RUN sed -i "s/#REACT_APP_FETCH_ENDPOINT#/${backend_api}/g" /swaggerdoc/btcreader-swagger.json