FROM postgres:alpine

MAINTAINER "Bong John Michael (john.m.bong@bath.edu) / jmb-51"

COPY ./init /docker-entrypoint-initdb.d/

COPY ./sqlexport /sqlexport/