const fetch = require('simple-fetch')

module.exports = function () {
  return function (dispatch) {
    fetch.getJson('/api/tasks')
    .then(function (tasks) {
      dispatch({type: 'SET_IS_LOADING_FALSE'})

      dispatch({type: 'POPULATE_TASKS', tasks})
    })
    .catch(function (error) {
      dispatch({type: 'SET_IS_LOADING_FALSE'})

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}
