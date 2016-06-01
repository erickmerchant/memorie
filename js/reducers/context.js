module.exports = function (state = {route: '', params: {}}, action) {
  if (action.type === 'SET_CONTEXT') {
    return action.context
  }

  return state
}
