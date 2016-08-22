const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, id, title) {
  show('/')

  var promise = fetch.putJson('/api/tasks/' + id, {title})
  .then(function (task) {
    dispatch('tasks', 'save', {id: task.id, title})
  })

  fetchingCount({dispatch}, promise)
}
