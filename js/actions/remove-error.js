module.exports = function ({dispatch}, error) {
  dispatch('errors', 'remove', error)
}
