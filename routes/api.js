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
var MongoClient = require('mongodb')
var ObjectId = require('mongodb').ObjectID

var dbConnection

function connectToDb() {
  if (!dbConnection) {
    dbConnection = MongoClient.connect(process.env.DB, { useNewUrlParser: true })
  }
  return dbConnection
}

module.exports = function(app) {
  app
    .route('/api/issues/:project')

    .get(function(req, res, next) {
      var project = req.params.project
      const { query } = req
      if (Object.prototype.hasOwnProperty.call(query, 'open')) {
        query.open = false
      }
      connectToDb()
        .then(client => {
          var db = client.db('issue-tracker')
          db.collection('issues')
            .find(query)
            .toArray()
            .then(docs => res.send(docs))
            .catch(err => Promise.reject(err))
        })
        .catch(next)
    })

    .post(function(req, res, next) {
      var project = req.params.project
      var {
        issue_title,
        issue_text,
        created_by,
        assigned_to = '',
        status_text = ''
      } = req.body
      if (!issue_title || !issue_text || !created_by) {
        return res.send('missing inputs')
      }
      var created_on = new Date()
      var updated_on = created_on
      var open = true
      connectToDb()
        .then(client => {
          var db = client.db('issue-tracker')
          db.collection('issues')
            .insertOne({
              issue_title,
              issue_text,
              created_by,
              assigned_to,
              status_text,
              created_on,
              updated_on,
              open
            })
            .then(doc => res.json(doc.ops[0]))
            .catch(err => Promise.reject(err))
        })
        .catch(next)
    })

    .put(function(req, res) {
      var project = req.params.project
      var { _id: id } = req.body
      var update = { $set: {} }
      var noFieldSent = true
      var keys = Object.keys(req.body).filter(key => key !== '_id')
      keys.forEach(key => {
        if (req.body[key] !== '') {
          update.$set[key] = req.body[key]
          noFieldSent = false
        }
      })
      if (Object.prototype.hasOwnProperty.call(req.body, 'open')) {
        update.$set.open = false
        noFieldSent = false
      }
      if (noFieldSent) {
        return res.send('no updated field sent')
      }
      update.$set.updated_on = new Date()
      connectToDb()
        .then(client => {
          var db = client.db('issue-tracker')
          db.collection('issues')
            .findOneAndUpdate({ _id: ObjectId(id) }, update)
            .then(doc => {
              if (doc.lastErrorObject.updatedExisting) {
                return res.send('successfully updated')
              }
              return res.send(`could not update ${id}`)
            })
            .catch(err => Promise.reject(err))
        })
        .catch(() => res.send(`could not update ${id}`))
    })

    .delete(function(req, res) {
      var project = req.params.project
      if (!Object.prototype.hasOwnProperty.call(req.body, '_id')) {
        return res.send('_id error')
      }
      const { _id: id } = req.body
      connectToDb()
        .then(client => {
          var db = client.db('issue-tracker')
          db.collection('issues')
            .findOneAndDelete({ _id: ObjectId(id) })
            .then(() => res.send(`deleted ${id}`))
            .catch(err => Promise.reject(err))
        })
        .catch(() => res.send(`could not delete ${id}`))
    })
}
