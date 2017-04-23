const ift = require('@erickmerchant/ift')('')
const form = require('./form')
const history = require('../history')
const preventDefault = require('prevent-default')
const html = require('yo-yo')

module.exports = function (app, currentId) {
  const {state} = app

  return ift(state.tasks, ([id, task]) => {
    if (currentId != null && id === currentId) {
      return form(app, task)
    }

    return html`<a class="col col-12 p2 center border-top border-bottom border-silver block black bold" href="/edit/${task.id}" onclick=${preventDefault(function (e) {
      history.push(`/edit/${task.id}`, {})
    })}>${task.title || 'untitled'}</a>`
  })
}
