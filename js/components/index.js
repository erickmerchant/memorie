const rows = require('./rows')
const spinner = require('./spinner')
const initTasksAction = require('../actions/tasks').init
const removeErrorAction = require('../actions/remove-error')
const diff = require('diffhtml')
const html = diff.html

module.exports = function () {
  return function (app, main = defaultMain) {
    const {state, dispatch, next} = app

    next(function () {
      initTasksAction({dispatch})
    })

    return html`<div>
      <div class="flex items-center clearfix white bg-maroon p2 bold">
        <div class="col-4 left-align">
          <a class="white h3" href="/">Memorie</a>
        </div>
        <div class="flex-auto justify-center items-center flex">
          ${fetchingCount()}
        </div>
        <div class="col-4 right-align">
          <a class="white" href="/create">Add</a>
        </div>
      </div>
      ${errors()}
      ${main(app)}
    </div>`

    function fetchingCount () {
      if (state.fetchingCount > 0) {
        return spinner({html}, 20)
      }

      return ''
    }

    function errors () {
      return [...state.errors].reverse().map((error) => html`<div class="clearfix flex items-center m1 p2 bg-fuchsia white"><div class="col col-11">${error.message}</div><div class="col col-1 center"><button class="btn" onclick=${removeError(error)}>x</button></div></div>`)
    }

    function removeError (error) {
      return function () {
        removeErrorAction({dispatch}, error)
      }
    }
  }
}

function defaultMain (app) {
  return rows(app)
}
