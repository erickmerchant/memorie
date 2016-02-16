'use strict'

const port = process.env.PORT || 8000
const databaseURL = process.env.DATABASE_URL
const staticDirectory = process.env.STATIC_DIRECTORY
const templateDirectory = process.env.TEMPLATE_DIRECTORY
const sessionSecret = process.env.SESSION_SECRET
const bcrypt = require('bcrypt')
const express = require('express')
const compression = require('compression')
const flash = require('simple-express-flash')
const bodyParser = require('body-parser')
const assert = require('assert-plus')
const morgan = require('morgan')
const pg = require('pg')
const atlatl = require('atlatl')({cacheDirectory: './storage/compiled/'})
const session = require('express-session')
const PgStore = require('connect-pg-simple')(session)
const app = express()

pg.connect(databaseURL, function (err, client) {
  if (err) {
    return console.error('error fetching client from pool', err)
  }

  app.engine('html', function (filePath, options, callback) {
    atlatl(filePath)
    .then(function (template) {
      callback(null, template(options))
    })
    .catch(callback)
  })

  app.set('view engine', 'html')
  app.set('views', templateDirectory)
  app.set('x-powered-by', false)

  app.use(compression())

  app.use(session({
    store: new PgStore({
      pg: pg
    }),
    name: 'memorie',
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    unset: 'destroy'
  }))

  app.use(flash)

  app.use(bodyParser.urlencoded({extended: true}))

  app.use(bodyParser.json())

  app.use(morgan('dev'))

  app.get('/api/task', function (req, res, next) {
    client.query('SELECT title, content FROM task WHERE account_id = $1 AND closed = false ORDER BY id ASC', [req.session.account_id], function (err, result) {
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

  app.use('/api/*', function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(500)
    res.json({error: err.message})
  })

  app.use(express.static(staticDirectory))

  app.post('/login', function (req, res, next) {
    if (req.body.name && req.body.password) {
      next()
    } else {
      req.flash('error', 'Name and password required')

      req.session.save(function (err) {
        if (err) {
          next(err)
        } else {
          res.redirect('/login')
        }
      })
    }
  }, function (req, res, next) {
    client.query('SELECT id, password FROM account WHERE name = $1', [req.body.name], function (err, result) {
      if (err) {
        next(err)
      } else {
        if (result.rows && result.rows.length) {
          req.user = result.rows[0]
          next()
        } else {
          req.flash('error', 'Name or password are incorrect')

          req.session.save(function (err) {
            if (err) {
              next(err)
            } else {
              res.redirect('/login')
            }
          })
        }
      }
    })
  }, function (req, res, next) {
    bcrypt.compare(req.body.password, req.user.password, function (err, same) {
      if (err) {
        next(err)
      } else {
        let dest = '/login'

        if (same) {
          req.session.account_id = req.user.id

          dest = '/'
        } else {
          req.flash('error', 'Name or password are incorrect')
        }

        req.session.save(function (err) {
          if (err) {
            next(err)
          } else {
            res.redirect(dest)
          }
        })
      }
    })
  })

  app.get('/logout', function (req, res, next) {
    delete req.session.account_id

    req.session.save(function (err) {
      if (err) {
        next(err)
      } else {
        res.redirect('/login')
      }
    })
  })

  app.get('/login', function (req, res, next) {
    res.render('login', {hasLogout: false, error: req.flash('error') || []}, function (err, html) {
      if (err) {
        next(err)
      } else {
        res.send(html)
      }
    })
  })

  app.use(function (err, req, res, next) {
    if (res.headersSent) {
      return next(err)
    }

    res.status(500)
    res.render('error', {hasLogout: false})
  })

  app.use(function (req, res, next) {
    if (!req.session.account_id) {
      res.redirect('/login')
    } else {
      res.render('index', {hasLogout: true})
    }
  })

  app.listen(port, function () {
    console.log('server is running at %s', port)
  })
})
