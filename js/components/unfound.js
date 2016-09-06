const diff = require('diffhtml')
const html = diff.html

module.exports = function () {
  return html`<main class="fixed flex top-0 left-0 bottom-0 right-0 bg-maroon"><img src="/loading.svg" class="flex-center mx-auto"></main>`
}
