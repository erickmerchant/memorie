const row = require('./partials/row')
const unfound = require('./unfound')
const actions = {
  init: require('../actions/init')
}

module.exports = function (state, app, main = defaultMain) {
  var {dispatch, next, hx} = app

  if (state.isLoading) {
    next(function () {
      dispatch(actions.init())
    })

    return unfound(state, app)
  }

  return hx`<div>
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
    ${main(state, app)}
  </div>`

  function fetchingCount () {
    if (state.fetchingCount > 0) {
      return hx`<img src="/loading.svg" style="height: 20px">`
    }
  }

  function alert (error) {
    return hx`<div class="block m1 p2 bg-fuchsia white">${error.message}</div>`
  }
}

function defaultMain (state, app) {
  var {hx} = app

  return hx`${state.tasks.map((task) => row(task, app))}`
}
