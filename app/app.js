var fetch = require('./fetch')
var templates = require('./templates')
var framework = require('./framework')

framework.redirect('/', '/task')

framework.route('/task', function (ctx) {
  return fetch('/api/task')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.list
  })
})

framework.action('test', function () {
  console.log('clicked')
})

framework.route('/task/new', function (ctx) {
  return fetch('/api/task')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.item
  })
})

framework.route('/task/:id', function (ctx) {
  return Promise.all([fetch('/api/task/' + ctx.params.id), fetch('/api/task')])
  .then(function ([task, tasks]) {
    ctx.state = {task, tasks}

    ctx.template = templates.item
  })
})

framework.run('main')
