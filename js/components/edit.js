const index = require('./index')
const rows = require('./rows')

module.exports = function (app) {
  return index(app, main)

  function main ({context}) {
    return rows(app, parseInt(context.params.id))
  }
}
