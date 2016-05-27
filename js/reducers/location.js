module.exports = function (state = '', action) {
  if (action.type === 'CHANGE_LOCATION') {
    return action.location
  }

  return state
}
