'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const browserify = require('browserify')
const streamToPromise = require('stream-to-promise')

function js () {
  var bundleFs = fs.createWriteStream('static/app.js')
  var bundle = browserify({})

  bundle.add('js/app.js')
  // bundle.transform('hyperxify')
  bundle.transform('babelify', { presets: [ 'es2015' ] })
  bundle.transform({ global: true }, 'uglifyify')
  bundle.bundle().pipe(bundleFs)

  return streamToPromise(bundle)
}

js.watch = function () {
  return js().then(function () {
    chokidar.watch('js/**/*.js', {ignoreInitial: true}).on('all', function () {
      js().catch(console.error)
    })

    return true
  })
}

module.exports = js
