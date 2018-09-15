const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')

// // // //

// Express.js App & Configuration
const app = express();

// parse JSON and url-encoded query
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// print the request log on console
app.use(morgan('dev'));

// Boostrap API routes - scopes all routes under /api
app.use('/api', require('./routes'));

// Serve static client assets
app.use(express.static('client'));

// Serve client HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '../client/index.html'));
})

// // // //

// Exports Express app
module.exports = app;
