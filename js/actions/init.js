const fetch = require('simple-fetch')
var promise

module.exports = function () {
  return function (dispatch) {
    if (promise == null) {
      promise = fetch.getJson('/api/tasks')
      .then(function (tasks) {
        dispatch({type: 'POPULATE_TASKS', tasks})
      })
      .catch(function (error) {
        dispatch({type: 'ADD_ERROR', error})
      })
    }

    setTimeout(function () {
      promise.then(function () {
        dispatch({type: 'SET_IS_LOADING_FALSE'})
      })
    }, 500)
  }
}
