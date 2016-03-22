var fetch = require('simple-fetch')
var scrollIntoView = require('scroll-into-view')
var catchLinks = require('catch-links')
var singlePage = require('single-page')
var wayfarer = require('wayfarer')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var hx = hyperx(vdom.h)
var loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}

fetch.getJson('/api/tasks').then(function (tasks) {
  var state = {tasks, mode: 'list'}
  var loop = mainLoop(state, function (state) {
    process.nextTick(function () {
      var form = document.querySelector('form')

      if (form) {
        scrollIntoView(form)
      }
    })

    return hx`<div>
      <div class="clearfix white bg-maroon p2 bold center h3">Memorie</div>
      ${state.error ? hx`<div class="block p2 bg-purple white">${state.error.message}</div>` : ''}
      ${(state.tasks || []).map((item) => {
        if (state.mode === 'edit' && item.id === state.task.id) {
          return viewItem(state.task)
        }

        return hx`<div class="col col-12 p1">
          <div class="max-width-2 mx-auto center">
            <a href="/edit/${item.id}" class="fuchsia">${item.title || 'untitled'}</a>
          </div>
        </div>`
      })}
      ${state.mode === 'create' ? viewItem(undefined) : hx`<div class="col col-12 p1">
        <div class="max-width-2 mx-auto center">
          <a href="/create" class="fuchsia">+ Add</a>
        </div>
      </div>`}
    </div>`

    function viewItem (task) {
      return hx`<form class="col col-12 bg-silver py3 px1" onsubmit=${task ? saveItem(task.id) : createItem}>
        <div class="black pb2 max-width-2 mx-auto">
          <label class="block my2">
            Title
            <input class="p1 input" type="text" placeholder="" name="title" value="${task ? task.title : ''}">
          </label>
          <label class="block my2">
            Content
            <textarea class="p1 textarea" type="text" placeholder="" name="content">${task ? task.content : ''}</textarea>
          </label>
          <div class="inline-block mr1 mb1"><button class="btn btn-primary bg-fuchsia" type="submit">Save</button></div>
          ${task ? hx`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-purple" type="button" onclick=${deleteItem(task.id)}>Delete</button></div>` : ''}
        </div>
      </form>`
    }
  }, loopOptions)

  var showPage = singlePage(function (href) {
    router(href)
  })

  var router = wayfarer()

  catchLinks(window, function (href) {
    showPage(href)
  })

  document.querySelector('main').appendChild(loop.target)

  router.on('/', function () {
    state.mode = 'list'

    fetch.getJson('/api/tasks').then(function (tasks) {
      state.tasks = tasks

      loop.update(state)
    })
  })

  router.on('/create', function () {
    state.mode = 'create'

    loop.update(state)
  })

  router.on('/edit/:id', function (params) {
    state.mode = 'edit'

    fetch.getJson('/api/tasks/' + params.id).then(function (task) {
      state.task = task

      loop.update(state)
    })
  })

  function createItem (e) {
    e.preventDefault()

    fetch.postJson('/api/tasks', {
      title: this.title.value,
      content: this.content.value
    })
    .then(refreshList)
  }

  function saveItem (id) {
    return function (e) {
      e.preventDefault()

      fetch.putJson('/api/tasks/' + id, {
        title: this.title.value,
        content: this.content.value
      })
      .then(refreshList)
    }
  }

  function deleteItem (id) {
    return function (e) {
      e.preventDefault()

      fetch.deleteJson('/api/tasks/' + id)
      .then(refreshList)
    }
  }

  function refreshList () {
    singlePage('/')
  }
})
