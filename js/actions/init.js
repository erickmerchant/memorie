const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')
let promise

module.exports = function ({dispatch}) {
  if (promise == null) {
    promise = fetch.getJson('/api/tasks')
    .then(function (tasks) {
      dispatch('tasks', 'populate', tasks)
    })
    .catch(function (error) {
      dispatch('errors', 'add', error)
    })

    fetchingCount({dispatch}, promise)
  }
}
