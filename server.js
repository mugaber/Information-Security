const path = require('path')
require('dotenv').config()

const express = require('express')
const app = express()

// middlewares
app.use(function(req, res, next) {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, content-type, Accept'
  })
  app.disable('x-powered-by')
  next()
})

// using helmet to protect http headers

const helmet = require('helmet')

// to protect from knowing your stack
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))

// to protect against xss
app.use(helmet.xssFilter({ action: 'deny' }))

// to not allow http if you are using https, t in sec
app.use(helmet.hsts({ maxAge: 10000000 }))

// to stop browsers from caching
app.use(helmet.noCache())

// to stop IE from using untrusted html
app.use(helmet.ieNoOpen())

// to stop inferring the contect type
app.use(helmet.noSniff())

// for updated
app.use(helmet.dnsPrefetchControl())

// for content security policy and setting trusted
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'other web sites']
    }
  })
)

// all of these middlewares except noCache and CSP  can
// be set only by using helmet(), then we can modify it
app.use(
  helmet({
    contentSecurityPolicy: false,
    noCache: true,
    xssFilter: { action: 'deny' }
  })
)

// static files
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

// running the server
app.listen(process.env.PORT, function() {
  console.log(`Server running at port ${process.env.PORT}`)
})
