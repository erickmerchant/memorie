const List = require('../types/list.js')

module.exports = function (state = new List(), action, data) {
  if (action === 'populate') {
    state.initialize(data.map((d) => [d.id, d]))
  }

  if (action === 'save') {
    state.set(data.id, data)
  }

  if (action === 'remove') {
    state.delete(data.id)
  }

  return state
}
