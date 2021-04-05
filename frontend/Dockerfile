FROM node:current-alpine

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

# install neccessary packages
RUN apk update && \
apk add curl vim wget openrc --no-cache

# Create app directory on docker
WORKDIR /frontend

# copy dotenv file to docker image
COPY .env ./serve/
COPY .env ./btcreader-frontend/

# copy files to docker image
COPY btcreader-frontend/ ./btcreader-frontend
COPY serve/ ./serve/

# extract node modules file to build frontend
WORKDIR /frontend/btcreader-frontend
RUN tar -xvzf node_modules.tar.gz

# run command to build serve
RUN yarn build

# run command to copy build folder for serving
RUN mv /frontend/btcreader-frontend/build /frontend/serve/build

# # use ash shell instead of sh
# SHELL ["/bin/ash", "-c"]

# Install app dependencies
# non-production
#RUN npm install 
# production - needs package-lock.json
WORKDIR /frontend/serve
RUN npm ci --only=production