const scrollIntoView = require('scroll-into-view')
const preventDefault = require('prevent-default')
const tasksActions = require('../actions/tasks')
const createTaskAction = tasksActions.create
const saveTaskAction = tasksActions.save
const removeTaskAction = tasksActions.remove
const diff = require('diffhtml')
const html = diff.html

module.exports = function ({dispatch, next, show}, task) {
  next(function (element) {
    var form = element.querySelector('form')
    var input = element.querySelector('input')

    scrollIntoView(form)

    input.focus()

    input.value = input.value
  })

  return html`<form class="left-align col col-12 bg-silver p2" onsubmit=${preventDefault(task ? save : create)}>
    <div class="black pb2 max-width-2 mx-auto">
      <label class="block my2">
        <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
      </label>
      <div class="mb1 right-align">
        <button class="btn btn-primary bg-maroon" type="submit">Save</button>
        <span> </span>
        ${task ? html`<button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove}>Delete</button>` : ''}
      </div>
    </div>
  </form>`

  function create (e) {
    var title = this.title.value

    createTaskAction({dispatch, show}, title)
  }

  function save (e) {
    var title = this.title.value

    saveTaskAction({dispatch, show}, task.id, title)
  }

  function remove (e) {
    removeTaskAction({dispatch, show}, task.id)
  }
}
