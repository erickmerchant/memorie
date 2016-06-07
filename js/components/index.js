const row = require('./partials/row.js')
const unfound = require('./unfound.js')
const actions = {
  init: require('../actions/init.js')
}

module.exports = function (state, {dispatch, show, hx}, main = defaultMain) {
  if (state.isLoading) {
    process.nextTick(function () {
      dispatch(actions.init())
    })

    return unfound(state, {hx})
  }

  return hx`<div>
    <div class="flex white bg-maroon p2 bold">
      <a class="white h3" href="/">Memorie</a>
      <span class="flex-auto center">
        ${fetchCount()}
      </span>
      <a class="white self-center" href="/create">Add</a>
    </div>
    ${state.errors.map(alert)}
    ${main(state, {dispatch, show, hx})}
  </div>`

  function fetchCount () {
    if (state.fetchingCount > 0) {
      return hx`<img src="/loading.svg" style="height: 20px">`
    }

    return ''
  }

  function alert (error) {
    return hx`<div class="block m1 p2 bg-fuchsia white">${error.message}</div>`
  }
}

function defaultMain (state, {hx}) {
  return hx`${state.tasks.map((task) => row(task, {hx}))}`
}
