const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function ({dispatch, show}, id) {
  show('/')

  var promise = fetch.deleteJson('/api/tasks/' + id)
  .then(function () {
    dispatch('tasks', 'remove', id)
  })

  fetchingCount({dispatch}, promise)
}
