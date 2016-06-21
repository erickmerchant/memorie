const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function (id, title) {
  return function (dispatch) {
    var promise = fetch.putJson('/api/tasks/' + id, {title})
    .then(function (task) {
      dispatch({type: 'SAVE_TASK', task: {id: task.id, title}})
    })

    dispatch(fetchingCount(promise))
  }
}
