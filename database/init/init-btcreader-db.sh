#!/bin/bash

# check if error occurs in script runtime.
set -o errexit

# the environment variables
# that must be set. 
# POSTGRES_USER is preset by docker image (postgres)
readonly REQUIRED_ENV_VARS=(
  "_DB_USER"
  "_DB_PASSWORD"
  "_DB_DATABASE"
  "POSTGRES_USER")


# Main execution:
# - verifies if all environment variables are set
# - runs the SQL code to create user and database
main() {
  validate_env_vars
  init_db
}


# Validate if env variables are set.
# If not, prompt to enter env variables to pass to script.
validate_env_vars() {
  for _env_var in ${REQUIRED_ENV_VARS[@]}; do
    if [[ -z "${!_env_var}" ]]; then
      echo "Error:
    Unset Environment variable '$_env_var'.
    Please make sure the following environment variables are set:
      ${REQUIRED_ENV_VARS[@]}
Aborting."
      exit 1
    fi
  done
}


# Performs the initialization in the already-started PostgreSQL
# using the preconfigured POSTGRES_USER user.
init_db() {
  # create user and database.
  psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
     CREATE USER $_DB_USER WITH PASSWORD '$_DB_PASSWORD';
     CREATE DATABASE $_DB_DATABASE;
     GRANT ALL PRIVILEGES ON DATABASE $_DB_DATABASE TO $_DB_USER;
EOSQL
# create the table to store the data
  psql -v ON_ERROR_STOP=1 --username "$_DB_USER" -d "$_DB_DATABASE" <<-EOSQL
    DROP TABLE IF EXISTS BTCUSDEXCHANGE;
    CREATE TABLE BTCUSDEXCHANGE(
        LASTCALLED     TIMESTAMP  NOT NULL,
        APIUPDATETIME  TIMESTAMP  NOT NULL,
        BTC            INT,
        USD            REAL
    );
EOSQL
# load the data previously backed up if sqlexport/btcreader.sql exist 
  if [ -f /sqlexport/btcusd-data.sql ]
  then
    psql -v ON_ERROR_STOP=1 --username "$_DB_USER" $_DB_DATABASE  < /sqlexport/btcusd-data.sql
  fi

}


# main routine
main "$@"