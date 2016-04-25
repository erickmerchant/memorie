'use strict'

const thenify = require('thenify')
const copy = thenify(require('fs-extra').copy)

module.exports = function () {
  return copy('node_modules/loading-svg/loading-bars.svg', 'static/loading.svg', {replace: true})
}
