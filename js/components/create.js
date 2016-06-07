const index = require('./index.js')
const form = require('./partials/form.js')
const row = require('./partials/row.js')

module.exports = function (state, {dispatch, show, hx}) {
  return index(state, {dispatch, show, hx}, main)

  function main (state, {dispatch, show, hx}) {
    return [
      form(null, {dispatch, show, hx}),
      state.tasks.map((task) => row(task, {hx}))
    ]
  }
}
