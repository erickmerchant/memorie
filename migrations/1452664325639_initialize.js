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
    }
  })

  pgm.createType('status', ['created', 'started', 'halted', 'blocked', 'completed'])

  pgm.createTable('item_version', {
    id: 'id',
    item_id: {
      type: 'int',
      references: 'item (id)'
    },
    ordinal: 'int',
    status: 'status',
    value: 'text',
    time: 'timestamp'
  })
}

exports.down = function (pgm) {

}
