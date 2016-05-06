var catchLinks = require('catch-links')
var singlePage = require('single-page')
var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var VText = require('virtual-dom/vnode/vtext')
var hx = hyperx(vdom.h)
var loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
var state = {}

function framework (view) {
  var loop = mainLoop(state, function (state) {
    if (!state) {
      return new VText('')
    }

    return view(state)
  }, loopOptions)
  var router = require('@erickmerchant/router')()

  var show = singlePage(function (href) {
    router.match(href)
  })

  catchLinks(window, function (href) {
    show(href)
  })

  return {
    show,
    update: loop.update,
    target: loop.target,
    state: loop.state,
    add: router.add,
    match: router.match
  }
}

framework.hx = hx

module.exports = framework
