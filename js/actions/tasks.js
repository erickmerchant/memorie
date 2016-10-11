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

  function request (url, options) {
    if (options.body != null) {
      options.body = JSON.stringify(options.body)
    }

    Object.assign(options, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let promise = fetch(url, options)
    .then((res) => {
      const json = res.json()

      if (!res.ok) {
        return json.then((err) => {
          if (err.error) {
            throw new Error(err.error)
          }

          throw new Error('Network error')
        })
      }

      return json
    })

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
