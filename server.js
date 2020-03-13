'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const mongo = require('mongodb').MongoClient
const passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy
require('dotenv').config()

const app = express()

app.use('/public', express.static(process.cwd() + '/public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'pug')

mongo.connect(
  process.env.DB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    if (err) {
      console.log('Database error: ' + err)
    } else {
      console.log('Successful database connection')

      app.use(
        session({
          secret: process.env.SECRET_KEY,
          resave: true,
          saveUninitialized: true
        })
      )

      app.use(passport.initialize())
      app.use(passport.session())

      function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
          return next()
        }
        res.redirect('/')
      }

      passport.serializeUser((user, done) => {
        done(null, user.id)
      })

      passport.deserializeUser((id, done) => {
        db.collection('socialusers').findOne({ id: id }, (err, doc) => {
          done(null, doc)
        })
      })

      /*
       *  ADD YOUR CODE BELOW
       */

      passport.use(
        new GitHubStrategy(
          {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'https://glitch.com/~glowing-warm-bay/auth/github/callback'
          },
          function(accessToken, refreshToken, profile, cb) {
            console.log(profile)

            db.collection('socialusers').findAndModify(
              { id: profile.id },
              {},
              {
                $setOnInsert: {
                  id: profile.id,
                  name: profile.displayName || 'John Doe',
                  photo: profile.photos[0].value || '',
                  email: profile.emails[0].value || 'No public email',
                  created_on: new Date(),
                  provider: profile.provider || ''
                },
                $set: {
                  last_login: new Date()
                },
                $inc: {
                  login_count: 1
                }
              },
              { upsert: true, new: true },
              (err, doc) => {
                return cb(null, doc.value)
              }
            )
          }
        )
      )

      app.get('/auth/github', passport.authenticate('github'))

      app
        .route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
          res.redirect('/profile')
        })

      /*
       *  ADD YOUR CODE ABOVE
       */

      app.route('/').get((req, res) => {
        res.render(process.cwd() + '/views/pug/index')
      })

      app.route('/profile').get(ensureAuthenticated, (req, res) => {
        res.render(process.cwd() + '/views/pug/profile', { user: req.user })
      })

      app.route('/logout').get((req, res) => {
        req.logout()
        res.redirect('/')
      })

      app.use((req, res, next) => {
        res
          .status(404)
          .type('text')
          .send('Not Found')
      })

      app.listen(process.env.PORT || 3000, () => {
        console.log('Listening on port ' + process.env.PORT)
      })
    }
  }
)
