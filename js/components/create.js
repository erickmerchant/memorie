const index = require('./index')
const form = require('./form')
const row = require('./row')

module.exports = function (app) {
  return index(app, main)

  function main ({state}) {
    return [
      form(app),
      state.tasks.map((task) => row(app, task))
    ]
  }
}
