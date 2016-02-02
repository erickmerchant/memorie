import './components/task-list.tag'
import './components/task-edit.tag'
import './components/task-new.tag'
import riot from 'riot'
const main = document.querySelector('main')

riot.route.base('/')

riot.route('logout', function () {
  riot.route.stop()

  window.location.reload(true)
})

riot.route('', view('task-list'))

riot.route('new', view('task-new'))

riot.route('*', view('task-edit'))

riot.route.start(true)

function view (tag) {
  var data = {}

  return function (id) {
    if (id) {
      data.id = id
    }

    main.innerHTML = '<' + tag + '></' + tag + '>'

    riot.mount(tag, data)

    riot.update()
  }
}
