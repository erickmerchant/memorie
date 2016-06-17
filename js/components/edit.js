const index = require('./index')
const form = require('./partials/form')
const row = require('./partials/row')

module.exports = function (state, app) {
  return index(state, app, main)

  function main (state, app) {
    return state.tasks.map((task) => {
      if (task.id === parseInt(state.context.params.id)) {
        return form(task, app)
      }

      return row(task, app)
    })
  }
}
