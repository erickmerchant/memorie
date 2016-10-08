/* global fetch */
let isInited = false

module.exports = function (dispatch, show) {
  return {
    init: function () {
      if (!isInited) {
        isInited = true

        request('/api/tasks', {}).then((tasks) => {
          dispatch('tasks', 'populate', tasks)
        })
      }
    },

    create (title) {
      show('/')

      request('/api/tasks', {
        method: 'post',
        body: {title}
      }).then((id) => {
        dispatch('tasks', 'save', {id, title})
      })
    },

    save (id, title) {
      show('/')

      request('/api/tasks/' + id, {
        method: 'put',
        body: {title}
      }).then(() => {
        dispatch('tasks', 'save', {id, title})
      })
    },

    remove (id) {
      show('/')

      request('/api/tasks/' + id, {method: 'delete'}).then(() => {
        dispatch('tasks', 'remove', {id})
      })
    }
  }

  function request (url, options, callback) {
    if (options.body != null) {
      options.body = JSON.stringify(options.body)
    }

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

    dispatch('fetchingCount', 'increment')

    setTimeout(() => {
      promise.then(() => {
        dispatch('fetchingCount', 'decrement')
      })
    }, 500)

    promise.catch((error) => {
      dispatch('fetchingCount', 'decrement')

      dispatch('errors', 'add', error)
    })

    return promise
  }
}
