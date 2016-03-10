var app = require('./framework')
var api = require('./api')
var templates = require('./templates')

app.redirect('/', '/task')

app.route('/task', function (ctx) {
  return api('/api/task').then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.list
  })
})

app.action('test', function () {
  console.log('clicked')
})

app.route('/task/new', function (ctx) {
  return api('/api/task').then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.item
  })
})

app.route('/task/:id', function (ctx) {
  return Promise.all([
    api('/api/task/' + ctx.params.id),
    api('/api/task')
  ]).then(function ([task, tasks]) {
    ctx.state = {task, tasks}

    ctx.template = templates.item
  })
})

app.run('main')
