const ObjectID = require('mongoose').ObjectId
const passport = require('passport')
const LocalStartegy = require('passport-local')

module.exports = (app, db) => {
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
}
