import './components/task-list.tag'
import './components/task-edit.tag'
import './components/task-new.tag'
import riot from 'riot'
import view from './view'

riot.route.base('/')

riot.route('logout', function () {
  riot.route.stop()

  window.location.reload(true)
})

riot.route('', view('task-list'))

riot.route('new', view('task-new'))

riot.route('*', view('task-edit'))

riot.route.start(true)
