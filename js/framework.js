var vdom = require('virtual-dom')
var VText = require('virtual-dom/vnode/vtext')
var hyperx = require('hyperx')
var mainLoop = require('main-loop')
var singlePage = require('single-page')
var catchLinks = require('catch-links')
var pathMatch = require('path-match')()
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
var routes = []
var current
var page

module.exports = {
  tag,
  route,
  redirect,
  run
}

function route (from, callback) {
  routes.push({
    match: pathMatch(from),
    callback: function (params) {
      var id = Symbol()

      current = id

      callback(params, {
        render: function (dom) {
          if (id === current) {
            loop.update(dom)
          }
        },
        redirect: function (to) {
          if (id === current) {
            setTimeout(function () {
              page(to)
            }, 0)
          }
        }
      })
    }
  })
}

function redirect (from, to) {
  routes.push({
    match: pathMatch(from),
    callback: function () {
      setTimeout(function () {
        page(to)
      }, 0)
    }
  })
}

function run (selector) {
  page = singlePage(function (href) {
    var params

    console.log(routes)

    for (let i = 0; i < routes.length; i++) {
      params = routes[i].match(href)

      console.log(params)

      if (params !== false) {
        routes[i].callback(params)

        break
      }
    }
  })

  catchLinks(window, function (href) {
    console.log(href)

    page(href)
  })

  document.querySelector(selector).appendChild(loop.target)
}
