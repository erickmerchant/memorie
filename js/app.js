var fetch = require('simple-fetch')
var scrollIntoView = require('scroll-into-view')
var framework = require('./framework.js')
var hx = framework.hx
var loading = 0
var app = framework(function (state) {
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
        ${loading ? hx`<img src="/loading.svg" class="flex-center mx-auto" height="24">` : ''}
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
    return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? editItem(task.id, state.done) : createItem(state.done)}>
      <div class="black pb2 max-width-2 mx-auto">
        <label class="block my2">
          <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
        </label>
        <div class="inline-block mr1 mb1"><button class="btn btn-primary bg-maroon" type="submit">Save</button></div>
        ${task ? hx`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-fuchsia" type="button" onclick=${deleteItem(task.id, state.done)}>Delete</button></div>` : ''}
      </div>
    </form>`
  }
})

app.add('', function (params, done) {
  fetch.getJson('/api/tasks')
  .then(function (tasks) {
    done(function () {
      app.update({mode: 'list', tasks, done})
    })
  })
  .catch(function (error) {
    app.update({mode: 'error', error, done})
  })
})

app.add('create', function (params, done) {
  fetch.getJson('/api/tasks')
  .then(function (tasks) {
    done(function () {
      app.update({mode: 'create', tasks, done})
    })
  })
  .catch(function (error) {
    app.update({mode: 'error', error, done})
  })
})

app.add('edit/:id', function (params, done) {
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
})

setTimeout(function () {
  var main = document.querySelector('main')

  main.innerHTML = ''

  main.appendChild(app.target)
}, 1500)

function createItem (done) {
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

function editItem (id, done) {
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

function deleteItem (id, done) {
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
