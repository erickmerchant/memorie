module.exports = function (state = [], action, data) {
  if (action === 'populate') {
    return data
  }

  if (action === 'create') {
    state.unshift(data)
  }

  if (action === 'save') {
    state = state.map(function (task) {
      if (task.id === data.id) {
        return data
      }

      return task
    })
  }

  if (action === 'remove') {
    state = state.filter(function (task) {
      return task.id !== data
    })
  }

  return state
}
