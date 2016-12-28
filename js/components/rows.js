const form = require('./form')
const html = require('yo-yo')

module.exports = function (app, currentId) {
  const {state} = app

  return html`${[...state.tasks].reverse().map(([id, task]) => {
    if (currentId != null && id === currentId) {
      return form(app, task)
    }

    return html`<a class="col col-12 p2 center border-top border-bottom border-silver block black bold" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
  })}`
}
