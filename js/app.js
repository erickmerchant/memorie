var fetch = require('./fetch')
var framework = require('./framework')
var tag = framework.tag
var redirect = framework.redirect
var route = framework.route
var run = framework.run

redirect('/', '/tasks')

route('/tasks', function (params, app) {
  fetch('/api/tasks')
  .then(function (tasks) {
    app.render(viewList({tasks}))
  })
  .catch(function (error) {
    app.render(viewList({error}))
  })
})

route('/tasks/new', function (params, app) {
  fetch('/api/tasks')
  .then(function (tasks) {
    app.render(viewList({tasks}))
  })
  .catch(function (error) {
    app.render(viewList({error}))
  })
})

route('/tasks/:id', function (params, app) {
  fetch(['/api/tasks/' + params.id, '/api/tasks'])
  .then(function ([task, tasks]) {
    app.render(viewItem({task, tasks}, app))
  })
  .catch(function (error) {
    app.render(viewItem({error}, app))
  })
})

run('main')

function viewList (state) {
  return tag`<div>
    <div class="clearfix">
      ${viewError(state)}
      ${viewItems(state)}
    </div>
  </div>`
}

function viewItem (state, app) {
  return tag`<div>
    <div class="clearfix">
      ${viewItems(state)}
    </div>
    <form class="fixed top-0 right-0 bottom-0 left-0 bg-white p2 mt3" onsubmit=${state.task ? saveItem(state.task.id, app) : createItem(app)}>
      ${viewError(state)}
      <h1>${state.task ? state.task.title : 'New Task'}</h1>
      <label class="block my2">
        Title
        <input class="col-12 sm-col-12 p1 input" type="text" placeholder="" name="title" value="${state.task ? state.task.title : ''}">
      </label>
      <label class="block my2">
        Content
        <textarea class="col-12 sm-col-12 p1 textarea" type="text" placeholder="" name="content">${state.task ? state.task.content : ''}</textarea>
      </label>
      <label class="block my2">
        Closed
        <input class="field" type="checkbox" name="closed" checked="${state.task && state.task.closed ? 'checked' : ''}">
      </label>
      <div class="inline-block mr1 mb1"><button class="btn btn-primary btn-big bg-fuchsia" type="submit">Save</button></div>
      ${state.task ? tag`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-purple" type="button" onclick=${deleteItem(state.task.id, app)}>Delete</button></div>` : ''}
    </form>
  </div>`
}

function viewError (state) {
  if (!state.error) return ''

  return tag`
  <div class="mt2 mb0 col col-12">
    <div class="p2 bg-purple white">${state.error.message}</div>
  </div>`
}

function viewItems (state) {
  return tag`<div class="col col-12">
    <h1>Tasks</h1>
    <ul class="fuchsia list-reset">
      ${(state.tasks || []).map((item) => {
        return tag`<li class="p1">
          ${item.closed ? tag`<del><a class="fuchsia" href="/tasks/${item.id}">${item.title || 'untitled'}</a></del>` : tag`<a class="fuchsia" href="/tasks/${item.id}">${item.title || 'untitled'}</a>`}
        </li>`
      })}
    </ul>
    <a class="btn btn-primary btn-big bg-fuchsia" href="/tasks/new">Add New</a>
  </div>`
}

function createItem (app) {
  return function (e) {
    e.preventDefault()

    fetch('/api/tasks', {
      method: 'post',
      body: JSON.stringify({
        title: this.title.value,
        content: this.content.value,
        closed: this.closed.checked
      })
    })
    .then(function () {
      app.redirect('/tasks')
    })
    .catch(function (error) {
      app.render(viewItem({error}, app))
    })
  }
}

function saveItem (id, app) {
  return function (e) {
    e.preventDefault()

    fetch('/api/tasks/' + id, {
      method: 'put',
      body: JSON.stringify({
        title: this.title.value,
        content: this.content.value,
        closed: this.closed.checked
      })
    })
    .then(function () {
      app.redirect('/tasks')
    })
    .catch(function (error) {
      app.render(viewItem({error}, app))
    })
  }
}

function deleteItem (id, app) {
  return function (e) {
    e.preventDefault()

    fetch('/api/tasks/' + id, {
      method: 'delete'
    })
    .then(function () {
      app.redirect('/tasks')
    })
    .catch(function (error) {
      app.render(viewItem({error}, app))
    })
  }
}
