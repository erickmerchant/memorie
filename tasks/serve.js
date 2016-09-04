'use strict'

var nodemon = require('nodemon')
var environment = require('dotenv').config()
var spawn = require('child_process').spawn

module.exports = function serve () {
  return new Promise(function (resolve, reject) {
    const postgres = spawn('postgres', ['-D', '/usr/local/var/postgres'])

    postgres.stdout.on('data', function (data) {
      console.log(`${data}`)
    })

    postgres.stderr.on('data', function (data) {
      console.error(`${data}`)
    })

    nodemon({
      ext: 'js,html,css',
      ignore: [ './compiled/' ],
      environment: environment,
      script: './server.js'
    })
  })
}
