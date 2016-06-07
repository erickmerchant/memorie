'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const browserify = require('browserify')
const streamToPromise = require('stream-to-promise')

function js (debug) {
  var bundleFs = fs.createWriteStream('static/app.js')
  var options = {}

  if (debug) {
    options.debug = true
  }

  var bundle = browserify(options)

  bundle.add('js/app.js')
  // bundle.transform('hyperxify')
  bundle.transform('babelify', { presets: [ 'es2015' ] })
  bundle.transform({ global: true }, 'uglifyify')
  bundle.bundle().pipe(bundleFs)

  return streamToPromise(bundle)
}

js.watch = function () {
  return js(true).then(function () {
    chokidar.watch('js/**/*.js', {ignoreInitial: true}).on('all', function () {
      js(true).catch(console.error)
    })

    return true
  })
}

module.exports = js
