var page = require('page')
var main = require('main-loop')
var api = require('./api.js')
var runtime = require('./runtime.js')
var ListTemplate = require('./list.html.js')(runtime)
var CreateTemplate = require('./create.html.js')(runtime)
var UpdateTemplate = require('./update.html.js')(runtime)
var app = {}
var loop = main(state, render, {
  document: document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var state, template

document.querySelector('main').appendChild(loop.target)

page(
  '/task',
  function (ctx, next) {
    api('/api/task').then(function (tasks) {
      state = {tasks: tasks}

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
    next()
  },
  function (ctx) {
    template = new CreateTemplate()

    loop.update(state)
  }
)

page(
  '/task/:id',
  function (ctx, next) {
    api('/api/task/' + ctx.params.id).then(function (task) {
      state = {task: task}

      next()
    })
  },
  function (ctx) {
    template = new UpdateTemplate()

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
