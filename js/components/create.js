const index = require('./index')
const form = require('./form')
const rows = require('./rows')
const diff = require('diffhtml')
const html = diff.html

module.exports = function (app) {
  return index(app, main)

  function main () {
    return html`${[
      html`<div id="new">${form(app)}</div>`,
      rows(app)
    ]}`
  }
}
