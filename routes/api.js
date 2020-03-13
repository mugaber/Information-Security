/*
 * Complete the API routing below
 */

'use strict'

var expect = require('chai').expect
var ConvertHandler = require('../controllers/convertHandler.js')

module.exports = function(app) {
  var convertHandler = new ConvertHandler()

  app.route('/api/convert').get(function(req, res) {
    var input = req.query.input
    if (!input) return res.json({ error: 'invalid number and unit' })

    var initNum = convertHandler.getNum(input)

    var initUnit = convertHandler.getUnit(input)

    if (!initNum && !initUnit) return res.json({ error: 'invalid number and unit' })
    if (!initNum) return res.json({ error: 'invalid number' })
    if (!initUnit) return res.json({ error: 'invalid unit' })

    var returnNum = convertHandler.convert(initNum, initUnit)

    var returnUnit = convertHandler.getReturnUnit(initUnit)

    var string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit)

    res.json({ initNum, initUnit, returnNum, returnUnit, string })
  })
}
