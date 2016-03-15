var main = require('main-loop')
var page = require('page')
var actions = {}
var current = {}
var loop = main({}, function (ctx) {
  current = Object.assign(current, ctx)

  if (!current.template) {
    return require('virtual-dom/h')('div')
  }

  return current.template.render(current.state, actions)
}, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})

function redirect (from, to) {
  if (to) {
    page.redirect(from, to)
  } else {
    page.redirect(from)
  }
}

function route (from, callback) {
  page(from, callback, (ctx) => {
    loop.update(ctx)
  })
}

function action (key, callback) {
  actions[key] = function (ctx) {
    return function (e) {
      return callback.call(this, e, ctx)
    }
  }
}

function extend (state) {
  loop.update({state: Object.assign(current.state, state)})
}

function run (target) {
  if (target) {
    document.querySelector(target).appendChild(loop.target)
  }

  page.base('')

  page()
}

module.exports = {
  redirect,
  route,
  action,
  extend,
  run
}
