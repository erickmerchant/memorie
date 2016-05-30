module.exports = function (state = true, action) {
  if (action.type === 'SET_IS_LOADING_FALSE') {
    return false
  }

  return state
}
