module.exports = function (state = new Set(), action, data) {
  if (action === 'add') {
    state.add(data)
  }

  if (action === 'remove') {
    state.delete(data)
  }

  return state
}
