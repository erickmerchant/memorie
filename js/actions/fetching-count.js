module.exports = function ({dispatch}, promise) {
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
