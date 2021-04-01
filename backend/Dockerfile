FROM node:current-alpine

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

# Create app directory on docker
WORKDIR /backend

# copy files to docker image
COPY src/ ./

# Install app dependencies
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8765

CMD [ "npm", "start" ]