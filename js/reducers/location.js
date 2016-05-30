module.exports = function (state = '', action) {
  if (action.type === 'SET_LOCATION') {
    return action.location
  }

  return state
}
