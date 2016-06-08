const fetch = require('simple-fetch')

module.exports = function (id) {
  return function (dispatch) {
    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    var promise = fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      dispatch({type: 'REMOVE_TASK', id})
    })
    .catch(function (error) {
      dispatch({type: 'ADD_ERROR', error})
    })

    setTimeout(function () {
      promise.then(function () {
        dispatch({type: 'DECREMENT_FETCHING_COUNT'})
      })
    }, 500)
  }
}
