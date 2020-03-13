const bodyParser = require('body-parser')
const express = require('express')
require('dotenv').config()

const session = require('express-session')
const passport = require('passport')

const routes = require('./routes')
const auth = require('./auth')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')
app.use('/public', express.static(process.cwd() + '/public'))

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true
  })
)

app.use(passport.initialize())
app.use(passport.session())

db.on('error', function(err) {
  console.log('DB connection error', err)
  mongoose.disconnect()
})

db.once('open', function() {
  console.log('DB connected')

  auth(app, db)

  routes(app, db)

  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + process.env.PORT)
  })
})
