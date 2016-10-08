const scrollIntoView = require('scroll-into-view')
const preventDefault = require('prevent-default')
const diff = require('diffhtml')
const html = diff.html

module.exports = function ({dispatch, next, show}, task) {
  const tasksActions = require('../actions/tasks')(dispatch, show)

  next(function (target) {
    const form = target.querySelector('form')
    const input = target.querySelector('input')

    scrollIntoView(form)

    input.focus()

    input.value = input.value
  })

  return html`<form class="left-align col col-12 bg-silver p2" onsubmit=${preventDefault(task ? save : create)}>
    <div class="black pb2 max-width-2 mx-auto">
      <label class="block my2">
        <input class="p1 input bold" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
      </label>
      <div class="mb1 right-align">
        <button class="btn btn-primary bg-maroon" type="submit">Save</button>
        ${task ? html`<span> </span><button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove}>Delete</button>` : ''}
      </div>
    </div>
  </form>`

  function create (e) {
    tasksActions.create(this.title.value)
  }

  function save (e) {
    tasksActions.save(task.id, this.title.value)
  }

  function remove (e) {
    tasksActions.remove(task.id)
  }
}
