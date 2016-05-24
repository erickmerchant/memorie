module.exports = function (state = [], action) {
  if (action.type === 'ADD_ERROR') {
    state.push(action.error)
  }

  return state
}
