const framework = require('@erickmerchant/framework')

const stateContainer = require('@erickmerchant/state-container')

const store = stateContainer(function (store) {
  store('errors', require('./stores/errors'))
  store('fetchingCount', require('./stores/fetching-count'))
  store('isLoading', require('./stores/is-loading'))
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

framework({target, store, component})
