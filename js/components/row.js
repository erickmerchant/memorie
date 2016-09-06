const diff = require('diffhtml')
const html = diff.html

module.exports = function (app, task) {
  return html`<a class="col col-12 p2 center border-top border-bottom border-silver block black" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
}
