module.exports = function (state = new Set(), action, data) {
  switch (action) {
    case 'add':
      state.add(data)
      break

    case 'remove':
      state.delete(data)
      break
  }

  return state
}
