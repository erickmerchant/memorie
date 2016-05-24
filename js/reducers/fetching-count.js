module.exports = function (state = 0, action) {
  if (action.type === 'INCREMENT_FETCHING_COUNT') {
    return state + 1
  }

  if (action.type === 'DECREMENT_FETCHING_COUNT') {
    return state - 1
  }

  return state
}
