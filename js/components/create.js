const index = require('./index')
const form = require('./form')
const rows = require('./rows')
const html = require('yo-yo')

module.exports = function (app) {
  return index(app, main)

  function main () {
    return html`${[
      html`<div id="new">${form(app)}</div>`,
      rows(app)
    ]}`
  }
}
