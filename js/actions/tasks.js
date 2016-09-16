/* global fetch */

let initPromise

module.exports = {
  init ({dispatch}) {
    if (initPromise == null) {
      initPromise = fetch('/api/tasks')
      .then(response)
      .then(json)
      .then(function (tasks) {
        dispatch('tasks', 'populate', tasks)
      })
      .catch(function (error) {
        dispatch('errors', 'add', error)
      })

      wrap({dispatch}, initPromise)
    }
  },

  create ({dispatch, show}, title) {
    show('/')

    var promise = fetch('/api/tasks', options({
      method: 'post',
      body: JSON.stringify({title})
    }))
    .then(response)
    .then(json)
    .then(function (id) {
      dispatch('tasks', 'save', {id, title})
    })

    wrap({dispatch}, promise)
  },

  save ({dispatch, show}, id, title) {
    show('/')

    var promise = fetch('/api/tasks/' + id, options({
      method: 'put',
      body: JSON.stringify({title})
    }))
    .then(response)
    .then(function () {
      dispatch('tasks', 'save', {id, title})
    })

    wrap({dispatch}, promise)
  },

  remove ({dispatch, show}, id) {
    show('/')

    var promise = fetch('/api/tasks/' + id, options({method: 'delete'}))
    .then(response)
    .then(function () {
      dispatch('tasks', 'remove', {id})
    })

    wrap({dispatch}, promise)
  }
}

function options (options) {
  return Object.assign({}, {
    headers: {
      'Content-Type': 'application/json'
    }
  }, options)
}

function json (res) {
  return res.json()
}

function response (res) {
  if (!res.ok) {
    return res.json().then(function (err) {
      if (err.error) {
        return Promise.reject(new Error(err.error))
      }

      throw new Error('Network error')
    })
  }

  return res
}

function wrap ({dispatch}, promise) {
  promise.catch(function (error) {
    dispatch('errors', 'add', error)
  })

  dispatch('fetchingCount', 'increment')

  setTimeout(function () {
    promise.then(function () {
      dispatch('fetchingCount', 'decrement')
    })
  }, 500)
}
