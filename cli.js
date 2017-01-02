'use strict'

const sergeant = require('sergeant/command')
const app = sergeant()
const css = require('./tasks/css')
const js = require('./tasks/js')
const svg = require('./tasks/svg')
const serve = require('./tasks/serve')

app.describe('Build the site then watch for changes. Run a server')
.action(function () {
  return Promise.all([
    svg(),
    css.watch(),
    js.watch()
  ])
  .then(serve)
})

app.run()
