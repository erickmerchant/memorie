const index = require('./index')
const form = require('./form')
const row = require('./row')

module.exports = function (app) {
  return index(app, main)

  function main ({state, params}) {
    return state.tasks.map((task) => {
      if (task.id === parseInt(params.id)) {
        return form(app, task)
      }

      return row(app, task)
    })
  }
}
