var main = require('main-loop')
var page = require('page')

class Framework {
  constructor () {
    this.actions = {}
    this.loop = main({}, this.render.bind(this), {
      document,
      create: require('virtual-dom/create-element'),
      diff: require('virtual-dom/diff'),
      patch: require('virtual-dom/patch')
    })
  }

  redirect (from, to) {
    page(from, function () {
      page(to)
    })
  }

  route (from, callback) {
    page(from, (ctx, next) => {
      callback(ctx).then(function () {
        next()
      })
    }, (ctx) => {
      this.loop.update({state: ctx.state, template: ctx.template})
    })
  }

  action (key, callback) {
    this.actions[key] = callback
  }

  run (target) {
    if (target) {
      document.querySelector(target).appendChild(this.loop.target)
    }

    page()
  }

  render (data) {
    if (!data.template) {
      return require('virtual-dom/h')('div')
    }

    return data.template.render(data.state, this.actions)
  }
}

module.exports = new Framework()
