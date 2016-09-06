const row = require('./row')
const initAction = require('../actions/init')
const diff = require('diffhtml')
const html = diff.html

module.exports = function (app, main = defaultMain) {
  var {state, dispatch, next} = app

  if (!state.tasks.length) {
    next(function () {
      initAction({dispatch})
    })
  }

  return html`<div>
    <div class="flex items-center clearfix white bg-maroon p2 bold">
      <div class="col-4 left-align">
        <a class="white h3" href="/">Memorie</a>
      </div>
      <div class="flex-auto center">
        ${fetchingCount()}
      </div>
      <div class="col-4 right-align">
        <a class="white" href="/create">Add</a>
      </div>
    </div>
    ${state.errors.map(alert)}
    ${main(app)}
  </div>`

  function fetchingCount () {
    if (state.fetchingCount > 0) {
      return html`<img src="/loading.svg" style="height: 20px">`
    }

    return ''
  }

  function alert (error) {
    return html`<div class="block m1 p2 bg-fuchsia white">${error.message}</div>`
  }
}

function defaultMain (app) {
  var {state, html} = app

  return html`${state.tasks.map((task) => row(app, task))}`
}
