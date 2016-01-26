import './components/example.tag'
import view from './view.js'
import riot from 'riot'

riot.route.base('/')

riot.route('', function () {
  riot.route('example/')
})

riot.route('example/', function () {
  view('example')
})

riot.route.start(true)
