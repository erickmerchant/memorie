var main = require('main-loop')
var page = require('page')
var actions = {}
var loop = main({}, function (ctx) {
  current = ctx

  if (!ctx.template) {
    return require('virtual-dom/h')('div')
  }

  return ctx.template.render(ctx.state, actions)
}, {
  document,
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
})
var current

function redirect (from, to) {
  if (to) {
    page.redirect(from, to)
  } else {
    page.redirect(from)
  }
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

function merge (state) {
  loop.update(Object.assign(current, {state: Object.assign(current.state, state)}))
}

module.exports = {
  redirect,
  route,
  action,
  run,
  merge
}
