const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const mainLoop = require('main-loop')
const catchLinks = require('catch-links')
const singlePage = require('single-page')
const loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}

function framework (store, page, view) {
  const dispatch = store.dispatch
  const show = singlePage(page)

  catchLinks(window, show)

  const loop = mainLoop(store.getState(), function (state) {
    return view(state, {dispatch, show})
  }, loopOptions)

  store.subscribe(function () {
    loop.update(store.getState())
  })

  return loop
}

framework.hx = hyperx(vdom.h)

module.exports = framework
