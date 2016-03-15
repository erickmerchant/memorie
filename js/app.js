var fetch = require('./fetch')
var templates = require('./templates')
var framework = require('./framework')

framework.redirect('/', '/tasks')

framework.route('/tasks', function (ctx, next) {
  fetch('/api/tasks')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.list

    next()
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.route('/tasks/new', function (ctx, next) {
  fetch('/api/tasks')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.form

    next()
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.route('/tasks/:id', function (ctx, next) {
  Promise.all([fetch('/api/tasks/' + ctx.params.id), fetch('/api/tasks')])
  .then(function ([task, tasks]) {
    ctx.state = {task, tasks}

    ctx.template = templates.form

    next()
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.action('create', function (e, ctx) {
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
    framework.redirect('/tasks')
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.action('save', function (e, ctx) {
  e.preventDefault()

  fetch('/api/tasks/' + ctx.id, {
    method: 'put',
    body: JSON.stringify({
      title: this.title.value,
      content: this.content.value,
      closed: this.closed.checked
    })
  })
  .then(function () {
    framework.redirect('/tasks')
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.action('delete', function (e, ctx) {
  e.preventDefault()

  fetch('/api/tasks/' + ctx.id, {
    method: 'delete'
  })
  .then(function () {
    framework.redirect('/tasks')
  })
  .catch(function (e) {
    framework.extend({error: e})
  })
})

framework.run('main')
