const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('authentication success')
    return next()
  }

  console.log('authentication error')
  return res.redirect('/')
}

exports.checkAuthenticated = checkAuthenticated
