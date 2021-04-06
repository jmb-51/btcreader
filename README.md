# btcreader
Author: John B 

Last updated: 06 Apr 2021

## Description

project to get latest btc conversion rate.

___
## modules/components 

The project contains 4 main components

### frontend
- Based on: ReactJS and bootstrapped using [Create React App](https://github.com/facebook/create-react-app).
- Contains the source code and dependencies.
- serve folder is used to serve the built app in node.js
- Container name: btcreader-frontend

### backend
- Based on Node.JS
- Powered by CoinDesk. Price page [here](https://www.coindesk.com/price/bitcoin)
- Contains the main functional block to call the coinbase API. (BTC USD exchange)
- Stores results obtained from coindesk API to the database module.
- Container name: btcreader-backend

### database
- Based on postgres SQL.
- Stores the btc-usd exchange pair including the last called time and coindesk api update time.
- Container name: btcreader-db

### swagger-ui
- OpenAPI specification to test the backend.
- Based on swagger-ui.
- Contains examples and a client to query the backend api and get the result in a visually pleasing manner.
- Container name: btcreader-swaggerui

___
## Deploying btcreader

### Prerequisites
- Debian Linux based OS (ubuntu or debian is fine) / MacOS (Windows is not tested)
- Latest version of Docker: Instllation Link for [Debian](https://docs.docker.com/engine/install/debian/) / [Ubuntu](https://docs.docker.com/engine/install/ubuntu/) / [MacOS](https://docs.docker.com/docker-for-mac/install/)
- docker-compose (latest version installed. Alternatively: 1.27.4 is a safe version) [Installation Link](https://docs.docker.com/compose/install/)
- make (if your system does not have it).
- git

### Deployment steps
- Pull this repository using git.
- **IMPORTANT: Open the file in btcreader/.env and configure the following field: 
```
# SET {YOUR_IP} to the private IP address of the machine hosting these images. (IPv4 notation)
# This step is very important otherwise the frontend and swagger-ui will not be able to
# fetch the data from the backend. 
# example: 1.2.3.4
# the IP can be found either using ifconfig in linux.

REACT_APP_FETCH_ENDPOINT={YOUR_IP}:8765
```
- The other parameters should not be changed. This should be the only parameter that **must be configured.
- Once completed, the tool can be build using either with the Makefile provided or btcreader.sh.

#### Using Makefile
- This is the recommended way as the build times are rather quick compared to btcreader.sh
- To start building and running the project. Please type the following commands below:
```
abc@def:~/btcreader$ make build run  
```
#### Using btecreader.sh
- This is the recommended way as the build times are rather quick compared to btcreader.sh
- To start building and running the project. Please type the following commands below:
```
abc@def:~/btcreader$ chmod +x btcreader.sh
abc@def:~/btcreader$ ./btcreader.sh build run
```
- Wait for a while and to verify that the containers are working fine. The following commands can be typed:
```
abc@def:~/btcreader$ docker ps -a
```
- 4 containers with the names mentioned in the modules/components section should be brought up.

___
## Accessing the APIs

### frontend
- Can be accessed using the link
```
http://{YOUR_IP}:9876
```
- Where {YOUR_IP} is the private IP address of the machine hosting these images. (IPv4 notation)
- example: 1.2.3.4
- The table will take up to 30 seconds to be displayed. Do not panic when you see the "No Data to display message". This is normal behaviour. After that the latest exchange rate will be updated to the table every 30 seconds.

### backend
- Can be accessed using the link
```
http://{YOUR_IP}:8765/api/v1/{routes}
```
- Where {YOUR_IP} is the private IP address of the machine hosting these images. (IPv4 notation) example: 1.2.3.4
- and {routes} are the available callable routes in the api. Please see the section ** Running Backend API Tests.

### database
- Can be accessed using the commands below
```
abc@def:~/btcreader$ docker exec -it btcreader-db bash
bash-5.2# psql -U {DB_USER} -d {DB_NAME}
psql >
```
- Any other postgres commands for viewing the database and tables can be used.
- Example commands: 'SELECT * FROM {DB_TABLE}'
- [Postgres SQL cheat sheet](https://www.postgresqltutorial.com/postgresql-cheat-sheet/)
- **Where {DB_USER} = "dbuser", {DB_NAME} = "btcreaderdb", {DB_TABLE} = "btcusdexchange"
- Please see btcreader/.env file to check the up to date values.

### swagger-ui
- Can be accessed using the link
```
http://{YOUR_IP}:10987/api-docs
```
- Where {YOUR_IP} is the private IP address of the machine hosting these images. (IPv4 notation) example: 1.2.3.4

___
## Running Backend API Tests

### Using curl

#### route: /rates/latest
- purpose: Get the latest btc usd exchange rate from coindesk api.
- method: GET
```
curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/rates/latest' \
  -H 'accept: application/json'
```
- Result: (Data will be returned as a JSON)
```
{
  "lastCalled": "2021-04-06 14:46:14+08:00",
  "apiUpdateTime": "2021-04-06T14:46:00+08:00",
  "btc": 1,
  "usd": 58898.1633
}
```

#### route: /rates/querytoday
- purpose: Query backend API and database for the btc usd exchange rates at the lastCalledTime for TODAY. If time is not found the nearest timestamp results TODAY will be given.
- method: POST
- request.body: time_of_day 
```
 curl -X 'POST' \
  'http://${YOUR_IP}:8765/api/v1/rates/querytoday' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "time_of_day": "14:46:29"
}'
```
- Result: (Data will be returned as a JSON)
- Bug: Time may not be converted to correct time zone. (defined in .env)
```
{
  "lastcalled": "2021-04-06T06:46:29.000Z",
  "apiupdatetime": "2021-04-06T06:46:00.000Z",
  "btc": 1,
  "usd": 58898.164
}
```
- Bug: if there is only one data in the database and the time_of_day has no entries in the database.
- A message like this may be displayed.
```
{
  "message": "TypeError: Cannot read property 'lastcalled' of undefined"
}
```

#### route: /showtable
- purpose: Show database table. Used by frontend to display exchange rate.
- method: GET
```
curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/showtable' \
  -H 'accept: application/json'
```
- Result: (Data will be returned as an array of JSON)
```
[
  {
    "lastcalled": "2021-04-06 14:46:14+08:00",
    "apiupdatetime": "2021-04-06 14:46:00+08:00",
    "btc": 1,
    "usd": 58898.164
  },
  {
    "lastcalled": "2021-04-06 14:46:29+08:00",
    "apiupdatetime": "2021-04-06 14:46:00+08:00",
    "btc": 1,
    "usd": 58898.164
  }
]
```

#### route: /showtable/paginated
- purpose: Show database table in page format. Every 10 rows of the entry is stored as a json field. For easier visualization.
- method: GET
```
curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/showtable/paginated' \
  -H 'accept: application/json'
```
- Result: (Data will be returned as an array of JSON)
```
  {
    "page1": [
      {
        "lastcalled": "2021-04-06 11:43:20+08:00",
        "apiupdatetime": "2021-04-06 11:43:00+08:00",
        "btc": 1,
        "usd": 58847.098
      },
      {
        "lastcalled": "2021-04-06 11:42:50+08:00",
        "apiupdatetime": "2021-04-06 11:42:00+08:00",
        "btc": 1,
        "usd": 58852.83
      }
    ],
    "page2": [
      {
        "lastcalled": "2021-04-06 11:38:20+08:00",
        "apiupdatetime": "2021-04-06 11:38:00+08:00",
        "btc": 1,
        "usd": 58856.984
      },
      {
        "lastcalled": "2021-04-06 11:37:50+08:00",
        "apiupdatetime": "2021-04-06 11:37:00+08:00",
        "btc": 1,
        "usd": 58858.254
      }
    ]
  }
```

#### route: /cleartable
- purpose: Clears database table of all entries
- method: POST
- request.body: operation
```
  curl -X 'POST' \
  'http://${YOUR_IP}:8765/api/v1/cleartable' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "operation": "cleartable"
}'
```
- Result: (Data will be returned as a JSON)
```
{
  "message": "table btcusdexchange cleared"
}
```

### Using swagger-ui
- usage is straightforward and the try buttons can be used to run tests similar to curl above.

___
## Playing around with Frontend API
- There is a box which can display the latest exchange rate from btc to usd and vice versa.
- The values in BTC/USD can be entered and a calculated result with the latest exchange rate will be displayed.

___
## Dumping/backing up data from the databasetable
- The following commands can be used to backup the data from the database for future use.
### Using Makefile
```
abc@def:~/btcreader$ make dbdump
```
### Using btcreader.sh
```
abc@def:~/btcreader$ ./btcreader.sh dbdump
```
- The output file will be stored in btcreader/database/sqlexport/btc

___
## Closing the btcreader project
### Using Makefile
```
abc@def:~/btcreader$ make clean_all
```
### Using btcreader.sh
```
abc@def:~/btcreader$ ./btcreader.sh clean_all
```
- This will stop the containers, remove them, remove the docker images and clean up the network/volumes that are used.
___
## Troubleshooting Support
- Contact the author for support. 
- Alternatively an issue can be filed.
___
## Screenshots
tbd


  	


