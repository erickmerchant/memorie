const fs = require('fs')

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

  fs.readFile('node_modules/connect-pg-simple/table.sql', 'utf8', function (err, sql) {
    if (err) throw err

    pgm.sql(sql)

    cb()
  })
}

exports.down = function (pgm) {

}
