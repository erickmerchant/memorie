var main = require('main-loop')
var page = require('page')
var actions = {}
var loop = main({}, render, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var current

function redirect (from, to) {
  page.redirect(from, to)
}

function goto (to) {
  page.redirect(to)
}

function back () {
  window.history.back()
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
  actions[key] = function (ctx) {
    return function (e) {
      return callback.call(this, e, ctx)
    }
  }
}

function run (target) {
  if (target) {
    document.querySelector(target).appendChild(loop.target)
  }

  page.base('')

  page()
}

function render (ctx) {
  current = ctx

  if (!ctx.template) {
    return require('virtual-dom/h')('div')
  }

  return ctx.template.render(ctx.state, actions)
}

function update (state) {
  loop.update(Object.assign(current, {state: Object.assign(current.state, state)}))
}

module.exports = {
  redirect,
  back,
  goto,
  route,
  action,
  run,
  update
}
