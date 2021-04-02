FROM node:current-alpine

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

# install neccessary packages
RUN apk update && \
apk add curl vim wget openrc --no-cache

# Create app directory on docker
WORKDIR /backend

# copy dotenv file to docker image
COPY .env ./

# copy files to docker image
COPY src/ ./

# # use ash shell instead of sh
# SHELL ["/bin/ash", "-c"]

# Install app dependencies
# non-production
#RUN npm install 
# production - needs package-lock.json
RUN npm ci --only=production

EXPOSE 8765