'use strict'

const express = require('express')
const _static = require('express-static')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert-plus')
const pg = require('pg')
const path = require('path')
const statuses = require('./statuses.js')
const app = express()
const databaseURL = process.env.DATABASE_URL
const port = process.env.PORT
const directory = process.env.DIRECTORY

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json())

  app.use(morgan('dev'))

  app.use(_static(directory))

  app.get('/api/list', function (req, res, next) {
    client.query('SELECT id, title, description FROM list', function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json(result.rows)
      }
    })
  })

  app.post('/api/list', function (req, res, next) {
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.description, 'Description is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.description, 'Description must be a string')

    client.query({
      name: 'insert-list',
      text: 'INSERT INTO list (title, description)  VALUES ($1, $2) RETURNING id',
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

  app.put('/api/list/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.description, 'Description is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.description, 'Description must be a string')

    client.query({
      name: 'update-list',
      text: 'UPDATE list SET title = $2, description = $3 WHERE id = $1',
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

  app.delete('/api/list/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

    client.query({
      name: 'delete-list',
      text: 'DELETE FROM list WHERE id = $1',
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

  app.get('/api/list/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

    client.query('SELECT id, title, description FROM list WHERE id = $1', [req.params.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        var list = result.rows[0]

        client.query('SELECT id, list_id, status, value FROM item WHERE list_id = $1', [req.params.id], function (err, result) {
          if (err) {
            next(err)
          } else {
            list.items = result.rows

            res.json(list)
          }
        })
      }
    })
  })

  app.post('/api/list/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')
    assert.ok(req.body.status, 'Status is required')
    assert.ok(statuses.contains(req.body.status) !== false, 'Status must be one of [' + statuses.join(', ') + ']')
    assert.ok(req.body.value, 'Value is required')
    assert.string(req.body.value, 'Value must be a string')

    client.query({
      name: 'insert-item',
      text: 'INSERT INTO item (list_id, status, value)  VALUES ($1, $2, $3) RETURNING id',
      values: [req.params.id, req.body.status, req.body.value]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(201)

        res.json(result.rows[0])
      }
    })
  })

  app.put('/api/item/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')
    assert.ok(req.body.status, 'Status is required')
    assert.ok(statuses.contains(req.body.status) !== false, 'Status must be one of [' + statuses.join(', ') + ']')
    assert.ok(req.body.value, 'Value is required')
    assert.string(req.body.value, 'Value must be a string')

    client.query({
      name: 'update-item',
      text: 'UPDATE item SET status = $2, value = $3 WHERE id = $1',
      values: [req.params.id, req.body.status, req.body.value]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.send('')
      }
    })
  })

  app.delete('/api/item/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

    client.query({
      name: 'delete-item',
      text: 'DELETE FROM item WHERE id = $1',
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

  app.get('/api/item/:id', function (req, res, next) {
    assert.ok(Number.isInteger(+req.params.id) !== false, 'ID must be an integer')

    client.query('SELECT id, list_id, status, value FROM item WHERE id = $1', [req.params.id], function (err, result) {
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
