module.exports = function (update) {
  var map = new Map()
  var currentSymbol

  return {add, match}

  function add (arr, callback) {
    var current = map

    arr.forEach(function (key, index) {
      var next
      var val = {}

      if (key.startsWith(':')) {
        val.param = key.substr(1)
        key = '*'
      }

      if (current.has(key)) {
        next = current.get(key).map
      } else {
        next = new Map()
      }

      val.map = next

      if (index + 1 === arr.length) {
        val.callback = callback
      }

      current.set(key, val)

      current = next
    })
  }

  function match (arr) {
    var current = map
    var params = {}
    var callback
    var result = true
    var symbol = Symbol()

    arr.forEach(function (key, index) {
      var next

      if (current.has(key)) {
        next = current.get(key)

        callback = next.callback

        current = next.map
      } else if (current.has('*')) {
        next = current.get('*')

        callback = next.callback

        params[next.param] = key

        current = next.map
      } else {
        result = false
      }

      if (result !== false && index + 1 === arr.length) {
        currentSymbol = symbol

        callback(params, function (payload) {
          if (symbol === currentSymbol) {
            update(payload)
          }
        })
      }
    })

    return result
  }
}
