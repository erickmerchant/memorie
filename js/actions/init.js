const fetch = require('simple-fetch')
var promise

module.exports = function ({dispatch}) {
  if (promise == null) {
    promise = fetch.getJson('/api/tasks')
    .then(function (tasks) {
      dispatch('tasks', 'populate', tasks)
    })
    .catch(function (error) {
      dispatch('errors', 'add', error)
    })

    setTimeout(function () {
      promise.then(function () {
        dispatch('isLoading', 'disable')
      })
    }, 500)
  }
}
