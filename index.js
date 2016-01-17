'use strict'

const express = require('express')
const _static = require('express-static')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert-plus')
const app = express()
const pg = require('pg')
const databaseURL = process.env.DATABASE_URL
const port = process.env.PORT

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json())

  app.use(morgan('dev'))

  app.use(_static('./public'))

  app.use(function (req, res, next) {
    req.session = {
      account: {
        name: 'test',
        id: 1
      }
    }

    next()
  })

  app.param('id', function (req, res, next, id) {
    assert.ok(id !== '' && +id === +id, 'ID must be an integer')

    next()
  })

  app.get('/api/list', function (req, res, next) {
    client.query('SELECT id, title, copy FROM list WHERE account_id = $1', [req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json(result.rows)
      }
    })
  })

  app.post('/api/list', function (req, res, next) {
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.copy, 'Copy is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.copy, 'Copy must be a string')

    client.query({
      name: 'insert-list',
      text: 'INSERT INTO list (account_id, title, copy)  VALUES ($1, $2, $3) RETURNING id, title, copy',
      values: [req.session.account.id, req.body.title, req.body.copy]
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
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.copy, 'Copy is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.copy, 'Copy must be a string')

    client.query({
      name: 'update-list',
      text: 'UPDATE list SET title = $3, copy = $4 WHERE id = $1 AND account_id = $2 RETURNING id, title, copy',
      values: [req.params.id, req.session.account.id, req.body.title, req.body.copy]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json(result.rows[0])
      }
    })
  })

  app.delete('/api/list/:id', function (req, res, next) {
    client.query({
      name: 'delete-list',
      text: 'DELETE FROM list WHERE id = $1 AND account_id = $2',
      values: [req.params.id, req.session.account.id]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json({})
      }
    })
  })

  app.get('/api/list/:id', function (req, res, next) {
    client.query('SELECT id, title, copy FROM list WHERE id = $1 AND account_id = $2', [req.params.id, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json(result.rows[0])
      }
    })
  })

  app.get('/api/list/:id/item', function (req, res, next) {
    client.query('SELECT item.id, item_version.ordinal, item_version.status, item_version.value FROM list RIGHT JOIN item ON list.id = item.list_id LEFT JOIN item_version ON item.id = item_version.item_id WHERE item.list_id = $1 AND list.account_id = $2 ORDER BY ordinal ASC, time DESC', [req.params.id, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.json(result.rows)
      }
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
})
