'use strict'

const express = require('express')
const _static = require('express-static')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const pg = require('pg')
const databaseUrl = process.env.DATABASE_URL
const port = process.env.PORT

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.use(morgan('dev'))

app.use(_static('./public'))

app.get('/api/account/', function (req, res, next) {
  pg.connect(databaseUrl, function (err, client, done) {
    if (err) next(err)

    client.query('SELECT * FROM account', function (err, result) {
      if (err) next(err)

      res.json(result.rows)

      done()
    })
  })
})

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)
  res.json({error: err.message})
})

app.listen(port, function () {
  console.log('server is running at %s', port)
})
