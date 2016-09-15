module.exports = function (state = new Map(), action, data) {
  if (action === 'populate') {
    state = new Map(data.map((d) => [d.id, d]))
  }

  if (action === 'save') {
    state.set(data.id, data)
  }

  if (action === 'remove') {
    state.delete(data.id)
  }

  return state
}
