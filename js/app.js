var fetch = require('simple-fetch')
var scrollIntoView = require('scroll-into-view')
var framework = require('./framework.js')
var hx = framework.hx
var app = framework(view)

app.add('', routeIndex)

app.add('create', routeCreate)

app.add('edit/:id', routeEdit)

setTimeout(function () {
  var main = document.querySelector('main')

  main.innerHTML = ''

  main.appendChild(app.target)
}, 1500)

function view (state) {
  process.nextTick(function () {
    var form = document.querySelector('form')
    var input = document.querySelector('input')

    if (form) {
      scrollIntoView(form)
    }

    if (input) {
      input.focus()
    }
  })

  return hx`<div>
    <div class="flex white bg-maroon p2 bold">
      <a class="white h3" href="/">Memorie</a>
      <span class="flex-auto">
      </span>
      <a class="white self-center" href="/create">Add</a>
    </div>
    ${state.error ? hx`<div class="block m1 p2 bg-fuchsia white">${state.error.message}</div>` : ''}
    ${state.mode === 'create' ? form() : ''}
    ${(state.tasks || []).map(row)}
  </div>`

  function row (task) {
    if (state.mode === 'edit' && task.id === state.task.id) {
      return form(task)
    }

    return hx`<a class="col col-12 p2 center border-bottom border-silver block black" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
  }

  function form (task) {
    return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? makeEdit(task.id, state.done) : makeCreate(state.done)}>
      <div class="black pb2 max-width-2 mx-auto">
        <label class="block my2">
          <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
        </label>
        <div class="inline-block mr1 mb1"><button class="btn btn-primary bg-maroon" type="submit">Save</button></div>
        ${task ? hx`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-fuchsia" type="button" onclick=${makeDelete(task.id, state.done)}>Delete</button></div>` : ''}
      </div>
    </form>`
  }
}

function routeIndex (params, done) {
  fetch.getJson('/api/tasks')
  .then(function (tasks) {
    done(function () {
      app.update({mode: 'list', tasks, done})
    })
  })
  .catch(function (error) {
    app.update({mode: 'error', error, done})
  })
}

function routeCreate (params, done) {
  fetch.getJson('/api/tasks')
  .then(function (tasks) {
    done(function () {
      app.update({mode: 'create', tasks, done})
    })
  })
  .catch(function (error) {
    app.update({mode: 'error', error, done})
  })
}

function routeEdit (params, done) {
  Promise.all([
    fetch.getJson('/api/tasks'),
    fetch.getJson('/api/tasks/' + params.id)
  ])
  .then(function ([tasks, task]) {
    done(function () {
      app.update({mode: 'edit', tasks, task, done})
    })
  })
  .catch(function (error) {
    app.update({mode: 'error', error, done})
  })
}

function makeCreate (done) {
  return function (e) {
    e.preventDefault()

    fetch.postJson('/api/tasks', {
      title: this.title.value
    })
    .then(function () {
      return fetch.getJson('/api/tasks')
    })
    .then(function (tasks) {
      done(function () {
        app.show('/')
      })
    })
    .catch(function (error) {
      app.update({mode: 'error', error, done})
    })
  }
}

function makeEdit (id, done) {
  return function (e) {
    e.preventDefault()

    fetch.putJson('/api/tasks/' + id, {
      title: this.title.value
    })
    .then(function () {
      done(function () {
        app.show('/')
      })
    })
    .catch(function (error) {
      app.update({mode: 'error', error, done})
    })
  }
}

function makeDelete (id, done) {
  return function (e) {
    e.preventDefault()

    fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      done(function () {
        app.show('/')
      })
    })
    .catch(function (error) {
      app.update({mode: 'error', error, done})
    })
  }
}
