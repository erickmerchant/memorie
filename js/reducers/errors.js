const ADD = Symbol()

function errors (state = [], action) {
  if (action.type === ADD) {
    state.push(action.error)
  }

  return state
}

errors.add = function (error) {
  return {type: ADD, error}
}

module.exports = errors
