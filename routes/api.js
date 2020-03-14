/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict'

require('dotenv').config()
var expect = require('chai').expect

const mongoose = require('mongoose')
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const BookModel = require('../BookModel')
var ObjectId = require('mongodb').ObjectId

const db = mongoose.connection
db.on('error', () => console.log('DB connection error'))
db.once('connected', () => console.log('DB connected'))

module.exports = function(app) {
  app
    .route('/api/books')

    //response will be array of book objects
    //json res: [{"_id": id, "title": title, "commentcount": comments no. },..]
    .get(function(req, res) {
      BookModel.find(function(err, docs) {
        if (err) return res.send('error getting books')
        if (!docs.length) return res.send('no books')

        const result = docs.map(doc => {
          return { _id: doc._id, title: doc.title, commentcount: doc.comments.length }
        })

        res.send(result)
      })
    })

    //response will contain new book object including atleast _id and title
    .post(function(req, res) {
      var title = req.body.title
      if (!title) return res.send('please provide a title')

      BookModel.findOne({ title }, function(err, doc) {
        if (err) return res.send('db error')
        if (doc) return res.send('book is already exists')

        BookModel.create({ title }, function(err, doc) {
          if (err) return res.send('error creating book')
          res.send({ title, _id: doc._id })
        })
      })
    })

    //if successful response will be 'complete delete successful'
    .delete(function(req, res) {
      BookModel.deleteMany(function(err) {
        if (err) return res.send('error deleting')
        res.send('complete delete successful')
      })
    })

  //

  app
    .route('/api/books/:id')

    //json res: {"_id": id, "title": title, "comments": [comment,comment,...]}
    .get(function(req, res) {
      var bookid = req.params.id
      if (!bookid) return res.send('please provide bookid')

      BookModel.findById(bookid, function(err, doc) {
        if (err) return res.send('db error')
        if (!doc) return res.send('book does not exist')
        res.send(doc)
      })
    })

    //json res format same as .get
    .post(function(req, res) {
      var bookid = req.params.id
      var comment = req.body.comment

      if (!bookid) return res.send('please provide bookid')
      if (!comment) return res.send('please provide a comment')

      BookModel.findById(bookid, function(err, doc) {
        if (err) return res.send(`db error ${err}`)
        if (!doc) return res.send('book does not exist')

        doc.comments.push({ comment })
        doc.save(function(err, doc) {
          if (err) return res.send(`db error ${err}`)
          res.send(doc)
        })
      })
    })

    //if successful response will be 'delete successful'
    .delete(function(req, res) {
      var bookid = req.params.id
      if (!bookid) return res.send('please provide bookid')

      BookModel.findByIdAndDelete(bookid, function(err) {
        if (err) return res.send(`db error: ${err}`)
        res.send('delete successful')
      })
    })
}
