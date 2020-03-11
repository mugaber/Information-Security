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

// using bcrypt for incryptin passords
const bcrypt = require('bcrypt')

const plaintextPassword = 'hithere'
const saltRounds = 13

// async
bcrypt.hash(plaintextPassword, saltRounds, function(err, encHash) {
  console.log(encHash) // $2b$13$T82Lqb5PUWz89HpFLelOFuGRa.WFXyqqgQQmvJUeBtAzv5anun/n2
  bcrypt.compare(plaintextPassword, encHash, function(err, same) {
    console.log(same)
  })
})

// sync
const hash = bcrypt.hashSync(plaintextPassword, saltRounds)
const same = bcrypt.compareSync(plaintextPassword, hash)
console.log(hash, same) // $2b$13$BJe1CnyrqgfkNYGRi1aC0Oj06wGsuEc7aA3qkhxP1V9KYvG.NQHmO

// static files
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

// running the server
// app.listen(process.env.PORT, function() {
//   console.log(`Server running at port ${process.env.PORT}`)
// })
