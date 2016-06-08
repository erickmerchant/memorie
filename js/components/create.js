const index = require('./index.js')
const form = require('./partials/form.js')
const row = require('./partials/row.js')

module.exports = function (state, app) {
  return index(state, app, main)

  function main (state, app) {
    return [
      form(null, app),
      state.tasks.map((task) => row(task, app))
    ]
  }
}
