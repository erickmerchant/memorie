/* global fetch */

const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, id) {
  show('/')

  var promise = fetch('/api/tasks/' + id, {method: 'delete'})
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
    dispatch('tasks', 'remove', {id})
  })

  fetchingCount({dispatch}, promise)
}
