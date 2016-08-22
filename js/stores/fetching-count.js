module.exports = function (state = 0, action) {
  if (action === 'increment') {
    return state + 1
  }

  if (action === 'decrement') {
    return state - 1
  }

  return state
}
