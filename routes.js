const checkAuthenticated = require('./middlewares').checkAuthenticated
const UserModel = require('./UserModel')
const passport = require('passport')

module.exports = (app, db) => {
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
}
