'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

require('dotenv').config()
const auth = require('./auth.js')
const passport = require('passport')
const routes = require('./routes.js')
const session = require('express-session')

const app = express()
const http = require('http').Server(app)
const mongo = require('mongodb').MongoClient
const sessionStore = new session.MemoryStore()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    key: 'express.sid',
    store: sessionStore
  })
)

mongo.connect(
  process.env.DB_URI,

  { useNewUrlParser: true, useUnifiedTopology: true },

  function(err, db) {
    if (err) console.log('Database error: ' + err)

    console.log('DB connected')

    auth(app, db)
    routes(app, db)

    http.listen(process.env.PORT || 3000)

    //start socket.io code

    //end socket.io code
  }
)
