/* global fetch */

import './components/lists.tag'
import './components/list.tag'
import riot from 'riot'

const main = document.querySelector('main')

riot.route('', function () { riot.route('/list/') })

riot.route('list/', function () {
  fetch('/api/list/')
  .then(checkStatus)
  .then(parseJSON)
  .then(function (lists) {
    main.innerHTML = '<lists></lists>'

    riot.mount('lists', {lists})

    riot.update()
  })
})

riot.route('list/*', function (id) {
  fetch('/api/list/' + id + '/')
  .then(checkStatus)
  .then(parseJSON)
  .then(function (list) {
    main.innerHTML = '<list></list>'

    riot.mount('list', list)

    riot.update()
  })
})

riot.route.start(true)

function checkStatus (response) {
  if (response.status >= 200 && response.status < 400) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}
