var fetch = require('simple-fetch')
var scrollIntoView = require('scroll-into-view')
var catchLinks = require('catch-links')
var singlePage = require('single-page')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var VText = require('virtual-dom/vnode/vtext')
var hx = hyperx(vdom.h)
var loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
var state = {}
var loop = mainLoop(state, function (state) {
  if (!state) {
    return new VText('')
  }

  process.nextTick(function () {
    var form = document.querySelector('form')

    if (form) {
      scrollIntoView(form)
    }
  })

  return hx`<div>
    <div class="flex white bg-maroon p2 bold">
      <span class="flex-auto h3">Memorie</span>
      <a class="white self-center" href="/create">+ Add</a>
    </div>
    <div class="center">
      ${state.error ? hx`<div class="block p2 bg-purple white">${state.error.message}</div>` : ''}
      ${state.mode === 'create' ? viewItem(undefined) : ''}
      ${(state.tasks || []).map((item) => {
        return state.mode === 'edit' && item.id === state.task.id ? viewItem(state.task) : hx`<a class="col col-12 p2 border-bottom border-silver block black" href="/edit/${item.id}">${item.title || 'untitled'}</a>`
      })}
    </div>
  </div>`

  function viewItem (task) {
    return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? editItem(task.id) : createItem}>
      <div class="black pb2 max-width-2 mx-auto">
        <label class="block my2">
          Title
          <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
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

var router = require('./router')(loop.update)

router.add([], function (params, update) {
  fetch.getJson('/api/tasks').then(function (tasks) {
    update({mode: 'list', tasks})
  })
})

router.add(['create'], function (params, update) {
  fetch.getJson('/api/tasks').then(function (tasks) {
    update({mode: 'create', tasks})
  })
})

router.add(['edit', ':id'], function (params, update) {
  Promise.all([
    fetch.getJson('/api/tasks'),
    fetch.getJson('/api/tasks/' + params.id)
  ]).then(function ([tasks, task]) {
    update({mode: 'edit', tasks, task})
  })
})

router.add([':event', 'create', ':data'], function (params, update) {
  params.event.preventDefault()

  fetch.postJson('/api/tasks', params.data)
  .then(function () {
    fetch.getJson('/api/tasks').then(function (tasks) {
      update({mode: 'list', tasks})

      showPage.push('/')
    })
  })
})

router.add([':event', 'edit', ':id', ':data'], function (params, update) {
  params.event.preventDefault()

  fetch.putJson('/api/tasks/' + params.id, params.data)
  .then(function () {
    fetch.getJson('/api/tasks').then(function (tasks) {
      update({mode: 'list', tasks})

      showPage.push('/')
    })
  })
})

router.add([':event', 'delete', ':id'], function (params, update) {
  params.event.preventDefault()

  fetch.deleteJson('/api/tasks/' + params.id).then(function () {
    fetch.getJson('/api/tasks').then(function (tasks) {
      update({mode: 'list', tasks})

      showPage.push('/')
    })
  })
})

var showPage = singlePage(function (href) {
  router.match(href.split('/').filter((v) => !!v))
})

catchLinks(window, function (href) {
  showPage(href)
})

document.querySelector('main').appendChild(loop.target)

function createItem (e) {
  router.match([e, 'create', {
    title: this.title.value,
    content: this.content.value
  }])
}

function editItem (id) {
  return function (e) {
    router.match([e, 'edit', id, {
      title: this.title.value,
      content: this.content.value
    }])
  }
}

function deleteItem (id) {
  return function (e) {
    router.match([e, 'delete', id])
  }
}
