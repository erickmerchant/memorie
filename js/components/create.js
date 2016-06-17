const index = require('./index')
const form = require('./partials/form')
const row = require('./partials/row')

module.exports = function (state, app) {
  return index(state, app, main)

  function main (state, app) {
    return [
      form(null, app),
      state.tasks.map((task) => row(task, app))
    ]
  }
}
