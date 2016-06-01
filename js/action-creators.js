const fetch = require('simple-fetch')

exports.init = function () {
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

exports.changeContext = function (context) {
  return {type: 'SET_CONTEXT', context}
}

exports.createTask = function (title) {
  return function (dispatch) {
    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    fetch.postJson('/api/tasks', {title})
    .then(function (task) {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'ADD_TASK', task: {id: task.id, title}})
    })
    .catch(function (error) {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}

exports.editTask = function (id, title) {
  return function (dispatch) {
    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    fetch.putJson('/api/tasks/' + id, {title})
    .then(function (task) {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'SAVE_TASK', task: {id: task.id, title}})
    })
    .catch(function (error) {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}

exports.removeTask = function (id) {
  return function (dispatch) {
    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'REMOVE_TASK', id})
    })
    .catch(function (error) {
      dispatch({type: 'DECREMENT_FETCHING_COUNT'})

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}
