/* global fetch */

module.exports = function (dispatch) {
  return function (url, options) {
    if (options.body != null) {
      options.body = JSON.stringify(options.body)
    }

    Object.assign(options, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    dispatch('fetchingCount', 'increment')

    return fetch(url, options)
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

      dispatch('fetchingCount', 'decrement')

      return json
    })
    .catch((error) => {
      dispatch('errors', 'add', error)
    })
  }
}
