const index = require('./index')
const rows = require('./rows')

module.exports = function ({params}) {
  return function (app) {
    return index()(app, main)

    function main () {
      return rows(app, parseInt(params.id))
    }
  }
}
