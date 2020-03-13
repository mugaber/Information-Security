'use strict'

var bodyParser = require('body-parser')
var expect = require('chai').expect
const helmet = require('helmet')
var cors = require('cors')

var fccTestingRoutes = require('./routes/fcctesting.js')
var apiRoutes = require('./routes/api.js')
var runner = require('./test-runner')
require('dotenv').config()

var express = require('express')
var app = express()

app.use(cors({ origin: '*' })) //For FCC testing purposes only

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//
app.use(helmet.noSniff())
app.use(helmet.xssFilter())

// Index page (static HTML and files)
app.use('/public', express.static(process.cwd() + '/public'))
app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

//For FCC testing purposes
fccTestingRoutes(app)

//Routing for API
apiRoutes(app)

//404 Not Found Middleware
app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found')
})

// Start our server and tests!
app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + process.env.PORT)
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...')
    setTimeout(function() {
      try {
        runner.run()
      } catch (e) {
        var error = e
        console.log('Tests are not valid:')
        console.log(error)
      }
    }, 1500)
  }
})

module.exports = app //for testing
