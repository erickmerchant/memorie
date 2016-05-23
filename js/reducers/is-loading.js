const END = Symbol()

function isLoading (state = true, action) {
  if (action.type === END) {
    return false
  }

  return state
}

isLoading.end = function () {
  return {type: END}
}

module.exports = isLoading
