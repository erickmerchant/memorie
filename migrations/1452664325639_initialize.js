exports.up = function (pgm) {
  pgm.createTable('account', {
    id: 'id',
    name: {
      type: 'text',
      unique: true
    },
    password: 'text',
    salt: 'text'
  })

  pgm.createTable('list', {
    id: 'id',
    account_id: {
      type: 'int',
      references: 'account (id)'
    },
    title: 'text',
    copy: 'text'
  })

  pgm.createTable('item', {
    id: 'id',
    list_id: {
      type: 'int',
      references: 'list (id)'
    },
    value: 'text'
  })

  pgm.createType('status', ['created', 'started', 'halted', 'stalled', 'blocked', 'completed'])

  pgm.createTable('action', {
    id: 'id',
    item_id: {
      type: 'int',
      references: 'item (id)'
    },
    status: 'status',
    value: 'text',
    time: 'timestamp'
  })
}

exports.down = function (pgm) {

}
