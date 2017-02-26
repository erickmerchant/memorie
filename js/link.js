const history = require('./history')
const preventDefault = require('prevent-default')

module.exports = preventDefault(function (e) {
  history.push(e.target.pathname, {})
})
