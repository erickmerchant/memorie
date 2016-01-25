import './components/lists.tag'
import './components/list.tag'
import './components/list-form.tag'
import './components/new-list.tag'
import view from './view.js'
import riot from 'riot'

riot.route.base('/')

riot.route('', function () {
  riot.route('list/')
})

riot.route('list/', function () {
  view('lists')
})

riot.route('list/new', function () {
  view('new-list')
})

riot.route('list/*', function (id) {
  view('list', {id})
})

riot.route.start(true)
