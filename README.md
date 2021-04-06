# btcreader
project to get latest btc conversion rate

add another text for fun haha.

curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/rates/latest' \
  -H 'accept: application/json'

  {
  "lastCalled": "2021-04-06 14:46:14+08:00",
  "apiUpdateTime": "2021-04-06T14:46:00+08:00",
  "btc": 1,
  "usd": 58898.1633
}

 content-length: 111 
 content-type: application/json; charset=utf-8 


 query
 curl -X 'POST' \
  'http://${YOUR_IP}:8765/api/v1/rates/querytoday' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "time_of_day": "14:46:29"
}'

{
  "lastcalled": "2021-04-06T06:46:29.000Z",
  "apiupdatetime": "2021-04-06T06:46:00.000Z",
  "btc": 1,
  "usd": 58898.164
}

cannot get those times that have no previous range and will say undefined
curl -X 'POST' \
  'http://${YOUR_IP}:8765/api/v1/rates/querytoday' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "time_of_day": "12:05:29"
}'

curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/showtable' \
  -H 'accept: application/json'

  	
Response body
Download
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

curl -X 'GET' \
  'http://${YOUR_IP}:8765/api/v1/showtable/paginated' \
  -H 'accept: application/json'

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

  curl -X 'POST' \
  'http://${YOUR_IP}:8765/api/v1/cleartable' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "operation": "cleartable"
}'

{
  "message": "table btcusdexchange cleared"
}

{
  "message": "TypeError: Cannot read property 'lastcalled' of undefined"
}