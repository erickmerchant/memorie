var vdom = require('virtual-dom')
var VText = require('virtual-dom/vnode/vtext')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var singlePage = require('single-page')
var trieRoute = require('trie-route')
var catchLinks = require('catch-links')
var tag = hyperx(vdom.h)
var loopOptions = {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
var loop = mainLoop(null, function (dom) {
  if (dom === null) {
    return new VText('')
  }

  return dom
}, loopOptions)
var router = trieRoute.create()
var current
var page

module.exports = {
  tag,
  route,
  redirect,
  run
}

function route (from, callback) {
  router.path(from, function (params) {
    var id = Symbol()

    current = id

    callback(params, {
      render: function (dom) {
        if (id === current) {
          loop.update(dom)
        }
      },
      redirect: function (to) {
        setTimeout(function () {
          page(to)
        }, 0)
      }
    })
  })
}

function redirect (from, to) {
  router.path(from, function () {
    setTimeout(function () {
      page(to)
    }, 0)
  })
}

function run (selector) {
  page = singlePage(function (href) {
    var error = router.process(href)

    if (error) {
      console.error(error)
    }
  })

  catchLinks(window, function (href) {
    console.log(href)

    page(href)
  })

  document.querySelector(selector).appendChild(loop.target)
}
