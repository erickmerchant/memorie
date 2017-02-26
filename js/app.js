const framework = require('@erickmerchant/framework')

const stateContainer = require('@erickmerchant/state-container')

const router = require('@erickmerchant/router')

const store = stateContainer(function (store) {
  store('context', router(['', 'create', 'edit/:id']))
  store('errors', require('./stores/errors'))
  store('fetchingCount', require('./stores/fetching-count'))
  store('tasks', require('./stores/tasks'))
})

const component = require('./components/index')

const target = document.querySelector('main')

const diff = require('yo-yo').update

framework({target, store, component, diff})(init)

function init ({dispatch}) {
  const request = require('./request')(dispatch)
  const history = require('./history')

  history.listen(function (location) {
    dispatch('context', location.pathname)
  })

  dispatch('context', history.location.pathname)

  request('/api/tasks', {}).then((tasks) => {
    dispatch('tasks', 'populate', tasks)
  })
}
