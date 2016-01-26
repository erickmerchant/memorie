exports.up = function (pgm) {
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
    deadline: 'timestamp',
    account_id: {
      type: 'int',
      references: 'account (id)'
    }
  })
}

exports.down = function (pgm) {

}
