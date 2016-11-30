'use strict'

const fs = require('fs')
const chokidar = require('chokidar')
const browserify = require('browserify')
const minifyify = require('minifyify')
const babelify = require('babelify')
const collapser = require('bundle-collapser/plugin')

function js () {
  var bundleFs = fs.createWriteStream('static/app.js')
  var options = {
    debug: true,
    plugin: [collapser]
  }

  var bundle = browserify(options)

  bundle.require('whatwg-fetch')
  bundle.add('js/app.js')
  bundle.plugin(minifyify, { map: './app.map', output: 'static/app.map' })
  bundle.transform(babelify, { presets: [ 'es2015' ], plugins: ['transform-tagged-diffhtml'] })
  bundle.bundle().pipe(bundleFs)

  return new Promise(function (resolve, reject) {
    bundleFs.once('finish', resolve)
    bundleFs.once('error', reject)
  })
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
