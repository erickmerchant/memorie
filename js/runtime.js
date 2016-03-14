var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var hx = hyperx(vdom.h)
var runtime = require('atlatl/runtime')

function template (strings) {
  var args = new Array(arguments.length)
  var i, j

  for (i = 1, j = 0; i < args.length; ++i, ++j) {
    if (typeof arguments[i] === 'function') {
      arguments[i] = runtime.safe(arguments[i])
    }

    args[j] = arguments[i]
  }

  args = runtime.values(args)

  args.unshift(strings)

  return hx.apply(null, args)
}

template.safe = runtime.safe

template.values = runtime.values

module.exports = template
