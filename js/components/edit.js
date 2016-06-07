const index = require('./index.js')
const form = require('./partials/form.js')
const row = require('./partials/row.js')

module.exports = function (state, {dispatch, show, hx}) {
  return index(state, {dispatch, show, hx}, main)

  function main (state, {dispatch, show, hx}) {
    return state.tasks.map((task) => {
      if (task.id === parseInt(state.context.params.id)) {
        return form(task, {dispatch, show, hx})
      }

      return row(task, {hx})
    })
  }
}
