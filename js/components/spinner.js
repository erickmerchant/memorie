const html = require('bel')

module.exports = function (app, size) {
  const borderWidth = Math.ceil(size / 4)

  return html`<div class="spinner" style="height: ${size}px; width: ${size}px; border-width: ${borderWidth}px"></div>`
}
