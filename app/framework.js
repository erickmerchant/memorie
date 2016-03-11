var main = require('main-loop')
var page = require('page')
var actions = {}
var loop = main({}, render, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var state

function redirect (from, to) {
  page(from, function () {
    page(to)
  })
}

function route (from, callback) {
  page(from, (ctx, next) => {
    callback(ctx).then(function () {
      next()
    })
  }, (ctx) => {
    loop.update(ctx)
  })
}

function action (key, callback) {
  actions[key] = callback
}

function run (target) {
  if (target) {
    document.querySelector(target).appendChild(loop.target)
  }

  page()
}

function render (ctx) {
  state = ctx.state

  if (!ctx.template) {
    return require('virtual-dom/h')('div')
  }

  return ctx.template.render(state, actions)
}

module.exports = {
  redirect,
  route,
  action,
  run
}
