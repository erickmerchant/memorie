/* global fetch */

require('whatwg-fetch')

module.exports = function (url, options = {}) {
  if (options) {
    options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return fetch(url, options).then(checkStatus).then(parseJSON)
}

function checkStatus (response) {
  if (response.ok) {
    return response
  }

  var error = new Error(response.statusText)
  error.response = response

  throw error
}

function parseJSON (response) {
  return response.text().then(function (text) {
    if (text) {
      return JSON.parse(text)
    }

    return ''
  })
}
