const framework = require('@erickmerchant/framework')

const stateContainer = require('@erickmerchant/state-container')

const store = stateContainer(function (store) {
  store('errors', require('./stores/errors'))
  store('fetchingCount', require('./stores/fetching-count'))
  store('tasks', require('./stores/tasks'))
})

const router = require('@erickmerchant/router')

const component = router(function (route) {
  route('', require('./components/index'))
  route('create', require('./components/create'))
  route('edit/:id', require('./components/edit'))
  route(require('./components/unfound'))
})

const target = document.querySelector('main')

const diff = require('diffhtml').innerHTML

framework({target, store, component, diff})(init)

function init ({dispatch}) {
  const request = require('./request')(dispatch)

  request('/api/tasks', {}).then((tasks) => {
    dispatch('tasks', 'populate', tasks)
  })
}
