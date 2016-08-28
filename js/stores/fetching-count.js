module.exports = function (state = 0, action) {
  if (action === 'increment') {
    state++
  }

  if (action === 'decrement') {
    state--
  }

  return state
}
