module.exports = function (state = [], action, data) {
  if (action === 'populate') {
    state = data
  }

  if (action === 'create') {
    state.unshift(data)
  }

  if (action === 'save') {
    state = state.map((task) => (task.id === data.id) ? data : task)
  }

  if (action === 'remove') {
    state = state.filter((task) => task.id !== data)
  }

  return state
}
