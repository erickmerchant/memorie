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
    description: 'text'
  })

  pgm.createType('status', ['incomplete', 'complete'])

  pgm.createTable('item', {
    id: 'id',
    list_id: {
      type: 'int',
      references: 'list (id)'
    },
    position: 'int',
    status: 'status',
    value: 'text'
  })
}

exports.down = function (pgm) {

}
