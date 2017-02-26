const history = require('./history')
const preventDefault = require('prevent-default')

module.exports = function (pathname) {
  return preventDefault(function (e) {
    history.push(pathname, {})
  })
}
