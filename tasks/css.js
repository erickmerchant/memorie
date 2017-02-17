'use strict'

const thenify = require('thenify')
const fs = require('fs')
const path = require('path')
const fsReadFile = thenify(fs.readFile)
const fsWriteFile = thenify(fs.writeFile)
const chokidar = require('chokidar')
const postcss = require('postcss')
const postcssPlugins = [
  require('postcss-import')(),
  require('postcss-inherit'),
  require('postcss-custom-media')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')(),
  require('autoprefixer'),
  require('cssnano')(),
  require('postcss-copy')({
    src: 'css',
    dest: 'static',
    relativePath (dirname, fileMeta, result, options) {
      return './static/'
    }
  })
]

function css () {
  return fsReadFile('css/app.css', 'utf-8')
  .then(function (css) {
    return postcss(postcssPlugins).process(css, {
      from: 'css/app.css',
      to: '/app.css',
      map: { inline: false, annotation: '/app.css.map' }
    }).then(function (output) {
      let map = JSON.parse(output.map)

      map.sources = map.sources.map((source) => path.relative(process.cwd(), '/' + source))

      return Promise.all([
        fsWriteFile('static/app.css', output.css),
        fsWriteFile('static/app.css.map', JSON.stringify(map))
      ])
    })
  })
}

css.watch = function () {
  return css().then(function () {
    chokidar.watch('css/**/*.css', {ignoreInitial: true}).on('all', function () {
      css().catch(console.error)
    })

    return true
  })
}

module.exports = css
