'use strict'

const sergeant = require('sergeant')
const app = sergeant().describe('Build CLI for Memorie')
const css = require('./tasks/css')
const js = require('./tasks/js')
const svg = require('./tasks/svg')
const serve = require('./tasks/serve')

app.command('update')
.describe('Build the site once')
.action(function () {
  return Promise.all([svg(), css(), js()])
})

app.command('watch')
.describe('Build the site then watch for changes. Run a server')
.action(function () {
  return Promise.all([
    svg(),
    css.watch(),
    js.watch()
  ])
  .then(serve)
})

app.run()
