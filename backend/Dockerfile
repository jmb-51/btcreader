FROM node:current-alpine

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

# install neccessary packages
RUN apk update && \
apk add curl vim wget openrc --no-cache

# Create app directory on docker
WORKDIR /backend

# copy files to docker image
COPY src/ ./

# # use ash shell instead of sh
# SHELL ["/bin/ash", "-c"]

# Install app dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8765