/* global fetch */

const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, id, title) {
  show('/')

  var promise = fetch('/api/tasks/' + id, {
    method: 'put',
    body: JSON.stringify({title}),
    headers: {
      'Content-Type': 'application/json'
    }})
  .then(function (res) {
    if (!res.ok) {
      return res.json().then(function (err) {
        if (err.error) {
          return Promise.reject(new Error(err.error))
        }

        throw new Error('Network error')
      })
    }

    return res
  })
  .then(function () {
    dispatch('tasks', 'save', {id, title})
  })

  fetchingCount({dispatch}, promise)
}
