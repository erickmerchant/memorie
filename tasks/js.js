'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const browserify = require('browserify')
const exorcist = require('exorcist')
const collapser = require('bundle-collapser/plugin')

function js (debug) {
  var bundleFs = fs.createWriteStream('static/app.js')
  var mapFile = 'static/app.map'
  var options = {
    plugin: [collapser]
  }

  if (debug) {
    options.debug = true
  }

  var bundle = browserify(options)

  bundle.add('js/app.js')
  bundle.transform('babelify', { presets: [ 'es2015' ], plugins: ['transform-tagged-diffhtml'] })
  bundle.transform({ global: true, mangle: true, compress: true }, 'uglifyify')
  bundle
  .bundle()
  .pipe(exorcist(mapFile))
  .pipe(bundleFs)

  return new Promise(function (resolve, reject) {
    bundleFs.once('finish', resolve)
    bundleFs.once('error', reject)
  })
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
