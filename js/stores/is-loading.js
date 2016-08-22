module.exports = function (state = true, action) {
  if (action === 'disable') {
    return false
  }

  return state
}
