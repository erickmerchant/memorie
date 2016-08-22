module.exports = function (state = [], action, data) {
  if (action === 'add') {
    state.push(data)
  }

  return state
}
