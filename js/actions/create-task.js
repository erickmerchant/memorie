/* global fetch */

const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, title) {
  show('/')

  var promise = fetch('/api/tasks', {
    method: 'post',
    body: JSON.stringify({title}),
    headers: {
      'Content-Type': 'application/json'
    }})
  .then(function (res) {
    if (res.ok) {
      return res.json()
    }

    return res.json().then(function (err) {
      if (err.error) {
        return Promise.reject(new Error(err.error))
      }

      throw new Error('Network error')
    })
  })
  .then(function (id) {
    dispatch('tasks', 'save', {id, title})
  })

  fetchingCount({dispatch}, promise)
}
