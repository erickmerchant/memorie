'use strict'

var nodemon = require('nodemon')
var environment = require('dotenv').config()

module.exports = function serve () {
  return new Promise(function (resolve, reject) {
    nodemon({
      ext: 'js,html',
      ignore: [ './compiled/' ],
      environment: environment,
      script: './server.js'
    })
  })
}
