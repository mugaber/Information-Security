const bodyParser = require('body-parser')
const express = require('express')
require('dotenv').config()
const app = express()

// const pug = require('pug')
app.use(bodyParser.json())
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/public', express.static(process.cwd() + '/public'))

app.get('/', function(req, res) {
  res.render('pug/index.pug')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + process.env.PORT)
})
