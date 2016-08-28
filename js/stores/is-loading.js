module.exports = function (state = true, action) {
  if (action === 'disable') {
    state = false
  }

  return state
}
