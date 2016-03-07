exports.up = function (pgm) {
  pgm.createTable('task', {
    id: 'id',
    title: 'text',
    content: 'text',
    closed: 'bool'
  })
}

exports.down = function (pgm) {

}
