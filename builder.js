'use strict'

const sergeant = require('sergeant')
const app = sergeant().describe('Build CLI for Memorie')
const css = require('./tasks/css.js')
const js = require('./tasks/js.js')
const serve = require('./tasks/serve.js')

app.command('update')
.describe('Build the site once')
.action(function () {
  return Promise.all([css(), js()])
})

app.command('watch')
.describe('Build the site then watch for changes. Run a server')
.action(function () {
  return Promise.all([
    css.watch(),
    js.watch()
  ])
  .then(serve)
})

app.run()
