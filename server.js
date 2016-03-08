'use strict'

const port = process.env.PORT || 8000
const databaseURL = process.env.DATABASE_URL
const staticDirectory = process.env.STATIC_DIRECTORY
const templateDirectory = process.env.TEMPLATE_DIRECTORY
const express = require('express')
const compression = require('compression')
const bodyParser = require('body-parser')
const assert = require('assert-plus')
const morgan = require('morgan')
const pg = require('pg')
const atlatl = require('atlatl')({cacheDirectory: './compiled/'})
const app = express()

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.engine('html', function (filePath, options, callback) {
    atlatl(filePath)
    .then(function (template) {
      callback(null, template.render(options))
    })
    .catch(callback)
  })

  app.set('view engine', 'html')
  app.set('views', templateDirectory)
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

  app.get('/api/task', function (req, res, next) {
    client.query('SELECT * FROM task WHERE closed = false ORDER BY id ASC', function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json(result.rows)
      }
    })
  })

  app.post('/api/task', function (req, res, next) {
    assert.ok(typeof req.body.title !== 'undefined', 'Title is required')
    assert.ok(typeof req.body.content !== 'undefined', 'Content is required')
    assert.ok(typeof req.body.closed !== 'undefined', 'Closed is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.content, 'Content must be a string')
    assert.bool(req.body.closed, 'Closed must be a bool')

    client.query({
      name: 'insert-task',
      text: 'INSERT INTO task (title, content, closed) VALUES ($1, $2, $3) RETURNING id',
      values: [req.body.title, req.body.content, req.body.closed]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(201)

        res.json(result.rows[0])
      }
    })
  })

  app.put('/api/task/:id', function (req, res, next) {
    assert.ok(typeof req.body.title !== 'undefined', 'Title is required')
    assert.ok(typeof req.body.content !== 'undefined', 'Content is required')
    assert.ok(typeof req.body.closed !== 'undefined', 'Closed is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.content, 'Content must be a string')
    assert.bool(req.body.closed, 'Closed must be a bool')

    client.query({
      name: 'update-task',
      text: 'UPDATE task SET title = $2, content = $3, closed = $4 WHERE id = $1',
      values: [req.params.id, req.body.title, req.body.content, req.body.closed]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.send('')
      }
    })
  })

  app.delete('/api/task/:id', function (req, res, next) {
    client.query({
      name: 'delete-task',
      text: 'DELETE FROM task WHERE id = $1',
      values: [req.params.id]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.send('')
      }
    })
  })

  app.get('/api/task/:id', function (req, res, next) {
    client.query('SELECT * FROM task WHERE id = $1', [req.params.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json(result.rows[0])
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
    res.render('index')
  })

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(500)
    res.render('error')
  })

  app.listen(port, function () {
    console.log('server is running at %s', port)
  })
})
