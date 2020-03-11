const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()

//
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html')
})

//
app.listen(process.env.PORT, function() {
  console.log(`Server running at port ${process.env.PORT}`)
})
