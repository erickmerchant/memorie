var vdom = require('virtual-dom')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var singlePage = require('single-page')
var trieRoute = require('trie-route')
var catchLinks = require('catch-links')
var hx = hyperx(vdom.h)
var initialState
var loop = mainLoop(initialState, function (state) {
  return hx`<a href="/click-here">Click Here</a>`
}, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var router = trieRoute.create()

module.exports = function (selector) {
  var current
  var page = singlePage(function (href) {
    current = href

    var error = router.process(href)
    console.log('error:', error)
  })

  document.querySelector(selector).appendChild(loop.target)

  catchLinks(window, function (href) {
    console.log('dsfsdf')

    page(href)
  })

  return {
    route: router.path,
    redirect: function (from, to) {
      setTimeout(function () {
        router.path(from, function () {
          page.push(to)
        })

        console.log(current)

        router.process(current)
      }, 0)
    }
  }
}
