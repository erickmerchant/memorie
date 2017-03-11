module.exports = function (state = new Map(), action, data) {
  switch (action) {
    case 'populate':
      state = new Map(data.map((d) => [d.id, d]))
      break

    case 'save':
      state.set(data.id, data)
      break

    case 'remove':
      state.delete(data.id)
      break
  }

  return state
}
