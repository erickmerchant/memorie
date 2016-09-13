const Set = require('../types/set.js')

module.exports = function (state = new Set(), action, data) {
  if (action === 'add') {
    state.set(data)
  }

  if (action === 'remove') {
    state.delete(data)
  }

  return state
}
