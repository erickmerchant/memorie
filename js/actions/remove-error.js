module.exports = function (dispatch) {
  return function (error) {
    dispatch('errors', 'remove', error)
  }
}
