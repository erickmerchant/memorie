'use strict'

const express = require('express')
const _static = require('express-static')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert-plus')
const pg = require('pg')
const path = require('path')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const app = express()
const databaseURL = process.env.DATABASE_URL
const port = process.env.PORT
const directory = process.env.DIRECTORY
const sessionSecret = process.env.SESSION_SECRET

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.use(session({
    store: new FileStore({
      path: 'storage/session/'
    }),
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true
  }))

  app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json())

  app.use(morgan('dev'))

  app.use(_static(directory))

  app.get('/api/task', function (req, res, next) {
    client.query('SELECT title, content, deadline FROM task WHERE account_id = $1 AND closed = false', [req.session.account_id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json(result.rows)
      }
    })
  })

  app.post('/api/task', function (req, res, next) {
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.description, 'Description is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.description, 'Description must be a string')

    client.query({
      name: 'insert-task',
      text: 'INSERT INTO task (title, description)  VALUES ($1, $2) RETURNING id',
      values: [req.body.title, req.body.description]
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
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.description, 'Description is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.description, 'Description must be a string')

    client.query({
      name: 'update-task',
      text: 'UPDATE task SET title = $2, description = $3 WHERE id = $1',
      values: [req.params.id, req.body.title, req.body.description]
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
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

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
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

    client.query('SELECT id, title, description FROM task WHERE id = $1', [req.params.id], function (err, result) {
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

  app.use('/', function (req, res, next) {
    res.sendFile(path.resolve(directory, 'index.html'))
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
})
