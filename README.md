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






# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
