const spinner = require('./spinner')
const diff = require('diffhtml')
const html = diff.html

module.exports = function () {
  return function () {
    return html`<div class="fixed flex items-center justify-center mx-auto top-0 left-0 bottom-0 right-0 bg-maroon">${spinner({html}, 40)}</div>`
  }
}
