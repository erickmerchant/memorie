const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, title) {
  show('/')

  var promise = fetch.postJson('/api/tasks', {title})
  .then(function (task) {
    dispatch('tasks', 'save', {id: task.id, title})
  })

  fetchingCount({dispatch}, promise)
}
