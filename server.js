'use strict'

var bodyParser = require('body-parser')
var expect = require('chai').expect
var helmet = require('helmet')
var cors = require('cors')

var fccTestingRoutes = require('./routes/fcctesting.js')
var apiRoutes = require('./routes/api.js')
var runner = require('./test-runner')
require('dotenv').config()

var express = require('express')
var app = express()

const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', () => console.log('DB connection error'))
db.once('connected', () => console.log('DB connection successful'))

app.use(helmet.noSniff())
app.use(helmet.xssFilter())
app.use(helmet())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: '*' }))

app.use('/public', express.static(process.cwd() + '/public'))

app.route('/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html')
})

//Sample front-end
app.route('/:project/').get(function(req, res) {
  res.sendFile(process.cwd() + '/views/issue.html')
})

fccTestingRoutes(app)

apiRoutes(app)

app.use(function(req, res, next) {
  res
    .status(404)
    .type('text')
    .send('Not Found')
})

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
    }, 3500)
  }
})

module.exports = app //for testing
