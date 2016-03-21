exports.up = function (pgm) {
  pgm.createTable('task', {
    id: 'id',
    title: 'text',
    content: 'text'
  })
}

exports.down = function (pgm) {

}
