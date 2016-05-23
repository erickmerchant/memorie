const INCREMENT = Symbol()
const DECREMENT = Symbol()

function fetchingCount (state = 0, action) {
  if (action.type === INCREMENT) {
    return state + 1
  }

  if (action.type === DECREMENT) {
    return state - 1
  }

  return state
}

fetchingCount.increment = function () {
  return { type: INCREMENT }
}

fetchingCount.decrement = function () {
  return { type: DECREMENT }
}

module.exports = fetchingCount
