const fs = require('fs')
const thenify = require('thenify')
const readFile = thenify(fs.readFile)

exports.up = function (pgm, cb) {
  pgm.createTable('account', {
    id: 'id',
    name: {
      type: 'text',
      unique: true
    },
    password: 'text'
  })

  pgm.createTable('task', {
    id: 'id',
    title: 'text',
    content: 'text',
    closed: 'bool',
    account_id: {
      type: 'int',
      references: 'account (id)'
    }
  })

  readFile('node_modules/connect-pg-simple/table.sql', 'utf8').then(function (sql) {
    pgm.sql(sql)

    cb()
  })
  .catch(cb)
}

exports.down = function (pgm) {

}
