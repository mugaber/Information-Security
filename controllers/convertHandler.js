/*
 *   Complete the handler logic below
 */

class ConvertHandler {
  getNum = function(input) {
    var result = input.slice(0, input.indexOf(input.match(/[A-Za-z]/g)[0]))
    console.log(result)
    if (!result) return 1

    try {
      return eval(result)
    } catch (err) {
      console.log(err)
      return ''
    }
  }

  getUnit = function(input) {
    var result = input.slice(input.indexOf(input.match(/[A-Za-z]/g)[0]), input.length)

    if (result !== 'gal' && result !== 'ibs' && result !== 'mi') return ''

    return result
  }

  getReturnUnit = function(initUnit) {
    if (initUnit === 'gal') return 'l'
    if (initUnit === 'lbs') return 'kg'
    if (initUnit === 'mi') return 'km'
  }

  convert = function(initNum, initUnit) {
    const galToL = 3.78541
    const lbsToKg = 0.453592
    const miToKm = 1.60934

    if (initUnit === 'gal') return (initNum * galToL).toFixed(5)
    if (initUnit === 'lbs') return (initNum * lbsToKg).toFixed(5)
    if (initUnit === 'mi') return (initNum * miToKm).toFixed(5)
  }

  spellOutUnit = function(unit) {
    var result
    return result
  }

  getString = function(initNum, initUnit, returnNum, returnUnit) {
    let initUnitSp
    let returnUnitSp

    if (initUnit === 'gal') initUnitSp = 'gallons'
    if (initUnit === 'lbs') initUnitSp = 'pounds'
    if (initUnit === 'mi') initUnitSp = 'miles'

    if (returnUnit === 'l') returnUnitSp = 'liters'
    if (returnUnit === 'kg') returnUnitSp = 'kilograms'
    if (returnUnit === 'km') returnUnitSp = 'kilometers'

    return `${initNum} ${initUnitSp} converts to ${returnNum} ${returnUnitSp}`
  }
}

module.exports = ConvertHandler
