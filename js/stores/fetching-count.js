module.exports = function (state = 0, action) {
  switch (action) {
    case 'increment':
      state++
      break

    case 'decrement':
      state--
      break
  }

  return state
}
