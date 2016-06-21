module.exports = function (promise) {
  return function (dispatch) {
    promise.catch(function (error) {
      dispatch({type: 'ADD_ERROR', error})
    })

    dispatch({type: 'INCREMENT_FETCHING_COUNT'})

    setTimeout(function () {
      promise.then(function () {
        dispatch({type: 'DECREMENT_FETCHING_COUNT'})
      })
    }, 500)
  }
}
