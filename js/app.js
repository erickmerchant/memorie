var fetch = require('./fetch')
var templates = require('./templates')
var framework = require('./framework')

framework.redirect('/', '/tasks')

framework.route('/tasks', function (ctx) {
  return fetch('/api/tasks')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.list
  })
  .catch(function (e) {
    framework.update({error: e})
  })
})

framework.route('/tasks/new', function (ctx) {
  return fetch('/api/tasks')
  .then(function (tasks) {
    ctx.state = {tasks}

    ctx.template = templates.item
  })
  .catch(function (e) {
    framework.update({error: e})
  })
})

framework.route('/tasks/:id', function (ctx) {
  return Promise.all([fetch('/api/tasks/' + ctx.params.id), fetch('/api/tasks')])
  .then(function ([task, tasks]) {
    ctx.state = {task, tasks}

    ctx.template = templates.item
  })
  .catch(function (e) {
    framework.update({error: e})
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
    framework.back()
  })
  .catch(function (e) {
    framework.update({error: e})
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
    framework.back()
  })
  .catch(function (e) {
    framework.update({error: e})
  })
})

framework.action('toggle', function (e, ctx) {
  e.preventDefault()

  fetch('/api/tasks/' + ctx.id, {
    method: 'put',
    body: JSON.stringify({
      title: ctx.title,
      content: ctx.content,
      closed: this.checked
    })
  })
  .then(function () {
    framework.back()
  })
  .catch(function (e) {
    framework.update({error: e})
  })
})

framework.action('delete', function (e, ctx) {
  e.preventDefault()

  fetch('/api/tasks/' + ctx.id, {
    method: 'delete'
  })
  .then(function () {
    framework.back()
  })
  .catch(function (e) {
    framework.update({error: e})
  })
})

framework.run('main')
