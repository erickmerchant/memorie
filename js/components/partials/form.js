const scrollIntoView = require('scroll-into-view')
const actions = {
  createTask: require('../../actions/create-task'),
  editTask: require('../../actions/edit-task'),
  removeTask: require('../../actions/remove-task')
}

module.exports = function (task, {dispatch, next, show, hx}) {
  next(function () {
    var form = document.querySelector('form')
    var input = document.querySelector('input')

    scrollIntoView(form)

    input.focus()
  })

  return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? edit : create}>
    <div class="black pb2 max-width-2 mx-auto">
      <label class="block my2">
        <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
      </label>
      <div class="mb1 right-align">
        <button class="btn btn-primary bg-maroon" type="submit">Save</button>
        ${task ? hx`<button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove}>Delete</button>` : ''}
      </div>
    </div>
  </form>`

  function create (e) {
    e.preventDefault()

    show('/')

    var title = this.title.value

    dispatch(actions.createTask(title))
  }

  function edit (e) {
    e.preventDefault()

    show('/')

    var title = this.title.value

    dispatch(actions.editTask(task.id, title))
  }

  function remove (e) {
    e.preventDefault()

    show('/')

    dispatch(actions.removeTask(task.id))
  }
}
