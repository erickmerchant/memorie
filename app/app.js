import './components/tasks.tag'
import riot from 'riot'
const main = document.querySelector('main')

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

  window.location.reload(true)
})

riot.route.start(true)

function view (tag, data) {
  main.innerHTML = '<' + tag + '></' + tag + '>'

  riot.mount(tag, data)

  riot.update()
}
