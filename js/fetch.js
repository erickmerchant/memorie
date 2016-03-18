/* global fetch */

require('whatwg-fetch')

module.exports = function _fetch (url, options = {}) {
  if (Array.isArray(url)) {
    return Promise.all(url.map(function (url) {
      return _fetch(url, options)
    }))
  }

  if (options) {
    options.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  return fetch(url, options).then(function (response) {
    if (response.ok) {
      return response
    }

    var error = new Error(response.statusText)
    error.response = response

    throw error
  }).then(function (response) {
    return response.text().then(function (text) {
      if (text) {
        return JSON.parse(text)
      }

      return ''
    })
  })
}
