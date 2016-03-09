var page = require('page')
var main = require('main-loop')
var api = require('./api.js')
var runtime = require('./runtime.js')
var ListTemplate = require('./list.html.js')(runtime)
var ItemTemplate = require('./item.html.js')(runtime)
var app = {}
var loop = main(state, render, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var state, template

document.querySelector('main').appendChild(loop.target)

page('/', function () {
  page('/task')
})

page(
  '/task',
  function (ctx, next) {
    api('/api/task').then(function (tasks) {
      state = {tasks}

      next()
    })
  },
  function (ctx) {
    template = new ListTemplate()

    loop.update(state)
  }
)

page(
  '/task/new',
  function (ctx, next) {
    api('/api/task').then(function (tasks) {
      state = {tasks}

      next()
    })
  },
  function (ctx) {
    template = new ItemTemplate()

    loop.update(state)
  }
)

page(
  '/task/:id',
  function (ctx, next) {
    Promise.all([
      api('/api/task/' + ctx.params.id),
      api('/api/task')
    ]).then(function ([task, tasks]) {
      state = {task, tasks}

      next()
    })
  },
  function (ctx) {
    template = new ItemTemplate()

    loop.update(state)
  }
)

page()

function render (state) {
  if (!template) {
    return require('virtual-dom/h')('div')
  }

  return template.render(state, app)
}
