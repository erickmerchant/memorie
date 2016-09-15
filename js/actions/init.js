/* global fetch */

const fetchingCount = require('./fetching-count')
let promise

module.exports = function ({dispatch}) {
  if (promise == null) {
    promise = fetch('/api/tasks')
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
    .then(function (tasks) {
      dispatch('tasks', 'populate', tasks)
    })
    .catch(function (error) {
      dispatch('errors', 'add', error)
    })

    fetchingCount({dispatch}, promise)
  }
}
