const fetch = require('simple-fetch')
const fetchingCount = require('./fetching-count')

module.exports = function (id) {
  return function (dispatch) {
    var promise = fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      dispatch({type: 'REMOVE_TASK', id})
    })

    dispatch(fetchingCount(promise))
  }
}
