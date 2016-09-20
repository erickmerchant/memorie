const diff = require('diffhtml')
const html = diff.html

module.exports = function (app, size) {
  const borderWidth = Math.ceil(size / 4)

  return html`<div class="circle rotate-500ms-linear-infinite border white" style="height: ${size}px; width: ${size}px; border-width: ${borderWidth}px; border-bottom-color: transparent; border-left-color: transparent;"></div>`
}
