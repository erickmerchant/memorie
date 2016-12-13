const index = require('./index')
const rows = require('./rows')

module.exports = function (app) {
  const {context} = app

  return index(app, main)

  function main () {
    return rows(app, parseInt(context.params.id))
  }
}
