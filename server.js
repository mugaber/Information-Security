'use strict'

const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const auth = require('./app/auth.js')
const routes = require('./app/routes.js')
const mongo = require('mongodb').MongoClient

const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
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

mongo.connect(process.env.DB, (err, db) => {
  if (err) console.log('DB error: ' + err)
  console.log('DB connected')

  auth(app, db)
  routes(app, db)

  http.listen(process.env.PORT || 3000, () => {
    console.log('server running')
  })

  const currentUsers = 0

  io.on('connection', socket => {
    console.log('a user connected')
    currentUsers++
  })
})
