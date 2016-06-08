const fetch = require('simple-fetch')

module.exports = function (id, title) {
  return function (dispatch) {
    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    var promise = fetch.putJson('/api/tasks/' + id, {title})
    .then(function (task) {
      dispatch({type: 'SAVE_TASK', task: {id: task.id, title}})
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
