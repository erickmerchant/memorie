'use strict'

const express = require('express')
const _static = require('express-static')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const assert = require('assert-plus')
const pg = require('pg')
const Hashids = require('hashids')
const app = express()
const databaseURL = process.env.DATABASE_URL
const port = process.env.PORT
const hashidsSalt = process.env.HASHIDS_SALT
const hashids = new Hashids(hashidsSalt)

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

  app.param('itemID', function (req, res, next, id) {
    let ids = hashids.decode(id)

    assert.ok(ids.length === 1, 'There was a problem')

    req.params.itemID = ids[0]

    next()
  })

  app.param('listID', function (req, res, next, id) {
    let ids = hashids.decode(id)

    assert.ok(ids.length === 1, 'There was a problem')

    req.params.itemID = ids[0]

    next()
  })

  app.get('/api/list', function (req, res, next) {
    client.query('SELECT id, title, description FROM list WHERE account_id = $1', [req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        result.rows = result.rows.map(function (row) {
          row.id = hashids.encode(row.id)
        })

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
      text: 'INSERT INTO list (account_id, title, description)  VALUES ($1, $2, $3) RETURNING id',
      values: [req.session.account.id, req.body.title, req.body.description]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(201)

        result.rows = result.rows.map(function (row) {
          row.id = hashids.encode(row.id)
          row.title = req.body.title
          row.description = req.body.description
        })

        res.json(result.rows[0])
      }
    })
  })

  app.put('/api/list/:listID', function (req, res, next) {
    assert.ok(req.body.title, 'Title is required')
    assert.ok(req.body.description, 'Description is required')
    assert.string(req.body.title, 'Title must be a string')
    assert.string(req.body.description, 'Description must be a string')

    client.query({
      name: 'update-list',
      text: 'UPDATE list SET title = $3, description = $4 WHERE id = $1 AND account_id = $2 RETURNING id',
      values: [req.params.listID, req.session.account.id, req.body.title, req.body.description]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        result.rows = result.rows.map(function (row) {
          row.id = hashids.encode(row.id)
          row.title = req.body.title
          row.description = req.body.description
        })

        res.json(result.rows[0])
      }
    })
  })

  app.delete('/api/list/:listID', function (req, res, next) {
    client.query({
      name: 'delete-list',
      text: 'DELETE FROM list WHERE id = $1 AND account_id = $2',
      values: [req.params.listID, req.session.account.id]
    }, function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        res.json({})
      }
    })
  })

  app.get('/api/list/:listID', function (req, res, next) {
    client.query('SELECT id, title, description FROM list WHERE id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        res.status(200)

        result.rows = result.rows.map(function (row) {
          row.id = hashids.encode(row.id)
        })

        res.json(result.rows[0])
      }
    })
  })

  app.get('/api/list/:listID/item', function (req, res, next) {
    client.query('SELECT id, list_id, position, status, value FROM item WHERE list_id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        result.rows = result.rows.map(function (row) {
          row.id = hashids.encode(row.id)
          row.list_id = hashids.encode(row.list_id)
        })

        res.json(result.rows)
      }
    })
  })

  app.post('/api/list/:listID/item', function (req, res, next) {
    assert.ok(req.body.position, 'Position is required')
    assert.string(req.body.position, 'Position must be a string')
    assert.ok(req.body.status, 'Status is required')
    assert.string(req.body.status, 'Status must be a string')
    assert.ok(req.body.value, 'Value is required')
    assert.string(req.body.value, 'Value must be a string')

    client.query('SELECT list_id FROM list WHERE list_id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        if (result.rows.length) {
          client.query({
            name: 'insert-item',
            text: 'INSERT INTO item (list_id, position, status, value)  VALUES ($1, $2, $3, $4) RETURNING id',
            values: [req.params.listID, req.body.position, req.body.status, req.body.value]
          }, function (err, result) {
            if (err) {
              next(err)
            } else {
              res.status(201)

              result.rows = result.rows.map(function (row) {
                row.id = hashids.encode(row.id)
                row.list_id = hashids.encode(req.params.listID)
                row.position = req.body.position
                row.status = req.body.status
                row.value = req.body.value
              })

              res.json(result.rows[0])
            }
          })
        } else {
          next()
        }
      }
    })
  })

  app.put('/api/list/:listID/item/:itemID', function (req, res, next) {
    assert.ok(req.body.position, 'Position is required')
    assert.string(req.body.position, 'Position must be a string')
    assert.ok(req.body.status, 'Status is required')
    assert.string(req.body.status, 'Status must be a string')
    assert.ok(req.body.value, 'Value is required')
    assert.string(req.body.value, 'Value must be a string')

    client.query('SELECT list_id FROM list WHERE list_id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        if (result.rows.length) {
          client.query({
            name: 'update-item',
            text: 'UPDATE item SET position = $2, status = $3, value = $4 WHERE id = $1 RETURNING id',
            values: [req.params.itemID, req.body.position, req.body.status, req.body.value]
          }, function (err, result) {
            if (err) {
              next(err)
            } else {
              res.status(200)

              result.rows = result.rows.map(function (row) {
                row.id = hashids.encode(row.id)
                row.list_id = hashids.encode(req.params.listID)
                row.position = req.body.position
                row.status = req.body.status
                row.value = req.body.value
              })

              res.json(result.rows[0])
            }
          })
        } else {
          next()
        }
      }
    })
  })

  app.delete('/api/list/:listID/item/:itemID', function (req, res, next) {
    client.query('SELECT list_id FROM list WHERE list_id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        if (result.rows.length) {
          client.query({
            name: 'delete-item',
            text: 'DELETE FROM item WHERE id = $1',
            values: [req.params.itemID]
          }, function (err, result) {
            if (err) {
              next(err)
            } else {
              res.status(200)

              res.json({})
            }
          })
        } else {
          next()
        }
      }
    })
  })

  app.get('/api/list/:listID/item/:itemID', function (req, res, next) {
    client.query('SELECT list_id FROM list WHERE list_id = $1 AND account_id = $2', [req.params.listID, req.session.account.id], function (err, result) {
      if (err) {
        next(err)
      } else {
        if (result.rows.length) {
          client.query('SELECT id, list_id, position, status, value FROM item WHERE id = $1', [req.params.listID, req.session.account.id], function (err, result) {
            if (err) {
              next(err)
            } else {
              res.status(200)

              result.rows = result.rows.map(function (row) {
                row.id = hashids.encode(row.id)
                row.list_id = hashids.encode(row.list_id)
              })

              res.json(result.rows[0])
            }
          })
        } else {
          next()
        }
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

  app.use(function (req, res, next) {
    res.status(404)

    res.json({error: 'Route not found'})
  })

  app.listen(port, function () {
    console.log('server is running at %s', port)
  })
})
