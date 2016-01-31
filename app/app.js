import './components/tasks.tag'
import view from './view.js'
import riot from 'riot'

riot.route.base('/')

riot.route('', function () {
  riot.route('tasks')
})

riot.route('tasks', function () {
  view('tasks')
})

riot.route('tasks/new', function () {
})

riot.route('tasks/*', function (id) {
})

riot.route('logout', function () {
  riot.route.stop()

  window.location.replace('/logout/')
})

riot.route.start(true)
