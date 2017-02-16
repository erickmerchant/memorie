'use strict'

const port = process.env.PORT || 8000
const databaseURL = process.env.DATABASE_URL
const staticDirectory = process.env.STATIC_DIRECTORY
const ift = require('@erickmerchant/ift')('')
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const assert = require('assert-plus')
const morgan = require('morgan')
const pg = require('pg')
const app = express()

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.set('x-powered-by', false)

  app.use(compression())

  app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json())

  app.use(morgan('dev'))

  app.use(express.static(staticDirectory))

  app.param('id', function (req, res, next, id) {
    assert.ok(Number.isInteger(+id) !== false, 'ID must be an integer')
    next()
  })

  app.get('/api/tasks', function (req, res, next) {
    client.query('SELECT * FROM task ORDER BY id ASC', function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json(result.rows)
      }
    })
  })

  app.post('/api/tasks', function (req, res, next) {
    assert.ok(typeof req.body.title !== 'undefined', 'Title is required')
    assert.string(req.body.title, 'Title must be a string')

    client.query({
      name: 'insert-task',
      text: 'INSERT INTO task (title) VALUES ($1) RETURNING id',
      values: [req.body.title]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(201)

        res.json(result.rows[0].id)
      }
    })
  })

  app.put('/api/tasks/:id', function (req, res, next) {
    assert.ok(typeof req.body.title !== 'undefined', 'Title is required')
    assert.string(req.body.title, 'Title must be a string')

    client.query({
      name: 'update-task',
      text: 'UPDATE task SET title = $2 WHERE id = $1',
      values: [req.params.id, req.body.title]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json('')
      }
    })
  })

  app.delete('/api/tasks/:id', function (req, res, next) {
    client.query({
      name: 'delete-task',
      text: 'DELETE FROM task WHERE id = $1',
      values: [req.params.id]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json('')
      }
    })
  })

  app.use('/api/*', function (req, res, next) {
    res.status(404)

    res.json({error: 'Route not found'})
  })

  app.use('/api/*', function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(500)
    res.json({error: err.message})
  })

  app.use('*', function (req, res, next) {
    res.status(200)

    res.type('html').send(template())
  })

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(500)

    res.type('html').send(template(err))
  })

  app.listen(port, function () {
    console.log('server is running at %s', port)
  })
})

function template (err) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Memorie</title>
        <link href="/favicon.png" rel="shortcut icon" type="image/png">
        <link rel="stylesheet" href="/app.css">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <main>
          <div>
            <div class="flex items-center clearfix white bg-maroon p2 bold">
              <div class="col-4 left-align">
                <a class="white h3" href="/">Memorie</a>
              </div>
              <div class="flex-auto center">
              </div>
              <div class="col-4 right-align">
              </div>
            </div>
            ${ift(err != null, () => `<div class="block m1 p2 bg-fuchsia white">${err.message}</div>`)}
          </div>
        </main>
        ${ift(err == null, `<script src="/app.js"></script>`)}
      </body>
    </html>`
}
