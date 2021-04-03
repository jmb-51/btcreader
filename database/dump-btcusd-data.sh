#!/bin/bash
source ../.env

docker exec btcreader-postgres pg_dump -U dbuser --column-inserts --data-only --table=btcusdexchange btcreaderdb -f /sqlexport/btcusd-data.sql
docker cp btcreader-postgres:/sqlexport/btcusd-data.sql sqlexport/btcusd-data.sql