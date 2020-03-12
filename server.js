const checkAuthenticated = require('./middlewares').checkAuthenticated
const bodyParser = require('body-parser')
require('dotenv').config()

const session = require('express-session')
const passport = require('passport')
const LocalStartegy = require('passport-local')

const UserModel = require('./UserModel')
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
const ObjectID = mongoose.ObjectId

const express = require('express')
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

  passport.serializeUser(function(user, done) {
    done(null, user._id)
  })

  passport.deserializeUser(function(id, done) {
    UserModel.findById(new ObjectID(id), function(err, doc) {
      if (err) return console.log('error getting user')
      done(null, doc)
    })
  })

  passport.use(
    new LocalStartegy(function(username, password, done) {
      UserModel.findOne({ username: username }, function(err, user) {
        console.log('User ' + username + ' attempted to login.')
        if (err) {
          console.log('localstartegy error')
          return done(err)
        }
        if (!user) {
          console.log('passport no user')
          return done(null, false)
        }
        if (password !== user.password) {
          console.log('password does not match')
          return done(null, false)
        }
        console.log('auth success')
        return done(null, user)
      })
    })
  )

  app.route('/').get(function(req, res) {
    res.render(process.cwd() + '/views/index.pug', {
      title: 'Hi',
      message: 'Login',
      showLogin: true,
      showRegistration: true
    })
  })

  app.route('/register').post(
    function(req, res, next) {
      const { username, password } = req.body

      UserModel.findOne({ username }, function(err, doc) {
        if (err) {
          console.log('find user error', err)
          return res.redirect('/')
        }

        if (doc) {
          console.log('already registered')
          return res.redirect('/')
        }

        UserModel.create({ username, password }, function(err, doc) {
          if (err) {
            console.log('error registering user')
            return res.redirect('/register')
          }

          next(null, doc)
        })
      })
    },

    passport.authenticate('local', { failureRedirect: '/' }),

    function(req, res) {
      res.redirect('/')
    }
  )

  app
    .route('/login')
    .post(passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
      const user = req.user
      console.log('route post login')
      res.redirect('/profile')
    })

  app.get('/profile', checkAuthenticated, function(req, res) {
    res.render('profile.pug')
  })

  app.post('/profile', checkAuthenticated, function(req, res) {
    console.log('het route /login post')
    res.render('profile.png')
  })

  app.route('/logout').get(function(req, res) {
    req.logout()
    res.redirect('/')
  })

  app.use((req, res, next) =>
    res
      .status(404)
      .type('text')
      .send('Not found')
  )

  app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + process.env.PORT)
  })
})
