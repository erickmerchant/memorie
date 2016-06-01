const view = require('./view.js')
const store = require('./store.js')
const options = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
const mainLoop = require('main-loop')
const dispatch = store.dispatch

const loop = mainLoop(store.getState(), function (state) {
  return view(state, dispatch)
}, options)

store.subscribe(function () {
  loop.update(store.getState())
})

document.querySelector('main').appendChild(loop.target)
