/* global fetch */

import './components/list.tag'
import riot from 'riot'

const main = document.querySelector('main')

riot.route.base('')

riot.route('/', list)
riot.route('/list/', list)

riot.route.start(true)

function list () {
  fetch('/api/list/')
  .then(checkStatus)
  .then(parseJSON)
  .then(function (list) {
    console.log(list)

    main.innerHTML = '<list></list>'

    riot.mount('list', {list})

    riot.update()
  })
}

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
