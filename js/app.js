const framework = require('@erickmerchant/framework')

const router = require('@erickmerchant/router')()

const combineStores = require('@erickmerchant/combine-stores')

const component = require('./components/index')

const diff = require('nanomorph')

const store = combineStores(function (store) {
  store('location', (state, location) => location)
  store('errors', require('./stores/errors'))
  store('fetchingCount', require('./stores/fetching-count'))
  store('tasks', require('./stores/tasks'))
})

const target = document.querySelector('main')

const options = {
  link: router.link,
  route: router.route
}

framework({target, store, component, options, diff})(init)

function init ({dispatch}) {
  const request = require('./request')(dispatch)
  const history = require('./history')

  history.listen(function (location) {
    dispatch('location', location.pathname)
  })

  dispatch('location', history.location.pathname)

  request('/api/tasks', {}).then((tasks) => {
    dispatch('tasks', 'populate', tasks)
  })
}
