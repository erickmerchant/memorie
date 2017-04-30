const framework = require('@erickmerchant/framework')

const combineStores = require('@erickmerchant/combine-stores')

const contextStore = require('@erickmerchant/context-store')

const store = combineStores(function (store) {
  store('context', contextStore(['', 'create', 'edit/:id']))
  store('errors', require('./stores/errors'))
  store('fetchingCount', require('./stores/fetching-count'))
  store('tasks', require('./stores/tasks'))
})

const component = require('./components/index')

const target = document.querySelector('main')

const diff = require('nanomorph')

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
