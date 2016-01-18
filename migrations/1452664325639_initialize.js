exports.up = function (pgm) {
  pgm.createTable('account', {
    id: 'id',
    name: {
      type: 'text',
      unique: true
    },
    password: 'text'
  })

  pgm.createTable('list', {
    id: 'id',
    title: 'text',
    description: 'text'
  })

  pgm.createType('status', require('../statuses.js'))

  pgm.createTable('item', {
    id: 'id',
    list_id: {
      type: 'int',
      references: 'list (id)'
    },
    status: 'status',
    value: 'text'
  })
}

exports.down = function (pgm) {

}
