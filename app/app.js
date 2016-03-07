var runtime = require('./runtime.js')
var Template = require('./template.html.js')(runtime)
var main = require('main-loop')
var state = {
  times: 0,
  collection: []
}
var app = {
  increment: function () {
    state.times += 1

    state.collection.push(Math.random())

    loop.update(state)
  }
}
var loop = main(state, render, {
  document: document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})

document.querySelector('main').appendChild(loop.target)

function render (state) {
  return (new Template()).render(state, app)
}
