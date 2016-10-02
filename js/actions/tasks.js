/* global fetch */

const once = require('once')

module.exports = {
  init: once(function ({dispatch}) {
    request(dispatch, '/api/tasks', {}, (tasks) => {
      dispatch('tasks', 'populate', tasks)
    })
  }),

  create ({dispatch, show}, title) {
    show('/')

    request(dispatch, '/api/tasks', {
      method: 'post',
      body: JSON.stringify({title})
    }, (id) => {
      dispatch('tasks', 'save', {id, title})
    })
  },

  save ({dispatch, show}, id, title) {
    show('/')

    request(dispatch, '/api/tasks/' + id, {
      method: 'put',
      body: JSON.stringify({title})
    }, () => {
      dispatch('tasks', 'save', {id, title})
    })
  },

  remove ({dispatch, show}, id) {
    show('/')

    request(dispatch, '/api/tasks/' + id, {method: 'delete'}, () => {
      dispatch('tasks', 'remove', {id})
    })
  }
}

function request (dispatch, url, options, callback) {
  let promise = fetch(url, Object.assign({}, {
    headers: {
      'Content-Type': 'application/json'
    }
  }, options))
  .then((res) => {
    if (!res.ok) {
      return res.json().then((err) => {
        if (err.error) {
          throw new Error(err.error)
        }

        throw new Error('Network error')
      })
    }

    return res
  })
  .then((res) => res.json().then(json => json).catch(() => null))
  .then(callback)

  promise = promise.catch((error) => {
    dispatch('errors', 'add', error)
  })

  dispatch('fetchingCount', 'increment')

  setTimeout(() => {
    promise.then(() => {
      dispatch('fetchingCount', 'decrement')
    })
  }, 500)
}
