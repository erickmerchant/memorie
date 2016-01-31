'use strict'

require('dotenv').config()

const sergeant = require('sergeant')
const app = sergeant().describe('CLI for memorie')
const bcrypt = require('bcrypt')
const chalk = require('chalk')
const assert = require('assert-plus')
const pg = require('pg')
const databaseURL = process.env.DATABASE_URL

app.command('account:list')
.describe('List accounts')
.action(function () {
  return new Promise(function (resolve, reject) {
    pg.connect(databaseURL, function (err, client) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }

      client.query('SELECT id, name FROM account', function (err, result) {
        if (err) {
          reject(err)
        } else {
          if (result.rows.length) {
            let longestId = String(Math.max.apply(null, result.rows.map(v => v.id))).length
            let longestName = Math.max.apply(null, result.rows.map(v => v.name.length))

            longestId = longestId > 2 ? longestId : 2

            console.log(' ' + chalk.bold.gray('id') + ' '.repeat(longestId - 'id'.length) + ' ' + chalk.gray('|') + ' name')

            console.log(chalk.gray(' ' + '-'.repeat(longestId) + '-|-' + '-'.repeat(longestName) + '--'))

            result.rows.forEach(function (row) {
              console.log(' ' + ' '.repeat(longestId - String(row.id).length) + chalk.bold.gray(row.id) + ' ' + chalk.gray('|') + ' ' + row.name)
            })
          } else {
            console.log(chalk.yellow('no accounts'))
          }

          resolve()
        }

        client.end()
      })
    })
  })
})

app.command('account:create')
.describe('Create an account')
.parameter('name')
.parameter('password')
.action(function (args) {
  assert.ok(args.get('name'), 'Name is required')
  assert.ok(args.get('password'), 'Password is required')
  assert.string(args.get('name'))
  assert.string(args.get('password'))

  var name = args.get('name')
  var password = args.get('password')

  return new Promise(function (resolve, reject) {
    pg.connect(databaseURL, function (err, client) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }

      bcrypt.genSalt(10, function (err, salt) {
        if (err) throw err

        bcrypt.hash(password, salt, function (err, password) {
          if (err) throw err

          client.query('INSERT INTO account (name, password)  VALUES ($1, $2) RETURNING id', [name, password], function (err, result) {
            if (err) {
              reject(err)
            } else {
              resolve('account ' + result.rows[0].id + ' created')
            }

            client.end()
          })
        })
      })
    })
  })
})

app.command('account:update')
.describe('Update an account')
.parameter('id')
.parameter('name')
.parameter('password')
.action(function (args) {
  assert.ok(args.get('id'), 'Name is required')
  assert.ok(args.get('name'), 'Name is required')
  assert.ok(args.get('password'), 'Password is required')
  assert.ok(Number.isInteger(+args.get('id')) !== false, 'ID must be an integer')
  assert.string(args.get('name'))
  assert.string(args.get('password'))

  var id = args.get('id')
  var name = args.get('name')
  var password = args.get('password')

  return new Promise(function (resolve, reject) {
    pg.connect(databaseURL, function (err, client) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }

      bcrypt.genSalt(10, function (err, salt) {
        if (err) throw err

        bcrypt.hash(password, salt, function (err, password) {
          if (err) throw err

          client.query('UPDATE account SET name = $2, password = $3 WHERE id = $1', [id, name, password], function (err, result) {
            if (err) {
              reject(err)
            } else {
              resolve('account ' + id + ' updated')
            }

            client.end()
          })
        })
      })
    })
  })
})

app.command('account:delete')
.describe('Delete an account')
.parameter('id')
.action(function (args) {
  assert.ok(args.get('id'), 'Name is required')
  assert.ok(Number.isInteger(+args.get('id')) !== false, 'ID must be an integer')

  var id = args.get('id')

  return new Promise(function (resolve, reject) {
    pg.connect(databaseURL, function (err, client) {
      if (err) {
        return console.error('error fetching client from pool', err)
      }

      client.query('DELETE FROM account WHERE id = $1', [id], function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve('account ' + id + ' deleted')
        }

        client.end()
      })
    })
  })
})

app.run()
.then(function (result) {
  result && console.log(chalk.green(result))
})
.catch(function (e) {
  console.error(chalk.red(e.message))
})
