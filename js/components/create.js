const index = require('./index')
const form = require('./form')
const row = require('./row')
const diff = require('diffhtml')
const html = diff.html

module.exports = function (app) {
  return index(app, main)

  function main ({state}) {
    return [
      html`<div id="new">${form(app)}</div>`,
      ...state.tasks.map((task) => row(app, task))
    ]
  }
}
