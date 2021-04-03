#!/bin/bash

# check if error occurs in script runtime.
set -o errexit

# the environment variables
# that must be set. 
# POSTGRES_USER is preset by docker image (postgres)
readonly REQUIRED_ENV_VARS=(
  "DB_USER"
  "_DB_PASSWORD"
  "DB_DATABASE"
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
     CREATE USER $DB_USER WITH PASSWORD '$_DB_PASSWORD';
     CREATE DATABASE $DB_DATABASE;
     GRANT ALL PRIVILEGES ON DATABASE $DB_DATABASE TO $DB_USER;
     ALTER DATABASE $DB_DATABASE SET timezone TO "${TIMEZONE}"
EOSQL
# create the table to store the data
  psql -v ON_ERROR_STOP=1 --username "$DB_USER" -d "$DB_DATABASE" <<-EOSQL
    DROP TABLE IF EXISTS $DB_TABLENAME;
    CREATE TABLE $DB_TABLENAME(
        LASTCALLED     TIMESTAMPTZ  NOT NULL,
        APIUPDATETIME  TIMESTAMPTZ  NOT NULL,
        BTC            INT,
        USD            REAL
    );
EOSQL
# load the data previously backed up if sqlexport/btcreader.sql exist 
  if [ -f /sqlexport/btcusd-data.sql ]
  then
    psql -v ON_ERROR_STOP=1 --username "$DB_USER" $DB_DATABASE  < /sqlexport/btcusd-data.sql
  fi

}


# main routine
main "$@"