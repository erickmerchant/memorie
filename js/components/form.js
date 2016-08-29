const scrollIntoView = require('scroll-into-view')
const createTaskAction = require('../actions/create-task')
const saveTaskAction = require('../actions/save-task')
const removeTaskAction = require('../actions/remove-task')

module.exports = function ({dispatch, next, show, html}, task) {
  next(function () {
    var form = document.querySelector('form')
    var input = document.querySelector('input')

    scrollIntoView(form)

    input.focus()
  })

  return html`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? save : create}>
    <div class="black pb2 max-width-2 mx-auto">
      <label class="block my2">
        <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
      </label>
      <div class="mb1 right-align">
        <button class="btn btn-primary bg-maroon" type="submit">Save</button>
        ${task ? html`&nbsp;<button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove}>Delete</button>` : ''}
      </div>
    </div>
  </form>`

  function create (e) {
    e.preventDefault()

    var title = this.title.value

    createTaskAction({dispatch, show}, title)
  }

  function save (e) {
    e.preventDefault()

    var title = this.title.value

    saveTaskAction({dispatch, show}, task.id, title)
  }

  function remove (e) {
    e.preventDefault()

    removeTaskAction({dispatch, show}, task.id)
  }
}
