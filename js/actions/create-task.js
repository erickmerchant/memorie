const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function (title) {
  return function (dispatch) {
    var promise = fetch.postJson('/api/tasks', {title})
    .then(function (task) {
      dispatch({type: 'ADD_TASK', task: {id: task.id, title}})
    })

    dispatch(fetchingCount(promise))
  }
}
