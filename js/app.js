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
    app.render(view({mode: 'list', tasks}))
  })
  .catch(function (error) {
    app.render(view({error}))
  })
})

route('/tasks/new', function (params, app) {
  fetch('/api/tasks')
  .then(function (tasks) {
    app.render(view({mode: 'create', tasks}, app))
  })
  .catch(function (error) {
    app.render(view({error}, app))
  })
})

route('/tasks/:id', function (params, app) {
  fetch(['/api/tasks/' + params.id, '/api/tasks'])
  .then(function ([task, tasks]) {
    app.render(view({mode: 'edit', task, tasks}, app))
  })
  .catch(function (error) {
    app.render(view({error}, app))
  })
})

run('main')

function view (state, app) {
  return tag`<div class="mt4 p2">
    ${state.error ? tag`<div class="mt2 mb0 col col-12">
      <div class="p2 bg-purple white">${state.error.message}</div>
    </div>` : ''}
    ${state.mode === 'create' ? viewItem(undefined, app) : ''}
    ${(state.tasks || []).map((item) => {
      if (state.task && item.id === state.task.id) {
        return viewItem(state.task, app)
      }

      return tag`<div class="max-width-4 mx-auto">
        ${item.closed ? tag`<del><a class="fuchsia" href="/tasks/${item.id}">${item.title || 'untitled'}</a></del>` : tag`<a class="fuchsia" href="/tasks/${item.id}">${item.title || 'untitled'}</a>`}
      </div>`
    })}
    <div class="fixed top-0 right-0 left-0 white bg-maroon p2 bold">
      <div class="left">
        <span class="btn">Memorie</span>
      </div>
      <div class="right">
        <a class="btn border--white white rounded" href="/tasks/new">+ Add</a>
      </div>
    </div>
  </div>`
}

function viewItem (task, app) {
  return tag`<form class="black pb2 max-width-4 mx-auto" onsubmit=${task ? saveItem(task.id, app) : createItem(app)}>
    <label class="block my2">
      Title
      <input class="p1 input" type="text" placeholder="" name="title" value="${task ? task.title : ''}">
    </label>
    <label class="block my2">
      Content
      <textarea class="p1 textarea" type="text" placeholder="" name="content">${task ? task.content : ''}</textarea>
    </label>
    <label class="block my2">
      Closed
      <input class="field" type="checkbox" name="closed" checked="${task && task.closed ? 'checked' : ''}">
    </label>
    <div class="inline-block mr1 mb1"><button class="btn btn-primary btn-big bg-fuchsia" type="submit">Save</button></div>
    ${task ? tag`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-purple" type="button" onclick=${deleteItem(task.id, app)}>Delete</button></div>` : ''}
  </form>`
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
