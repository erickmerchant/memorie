var runtime = require('./runtime')
var ListTemplate = require('./templates/list.html.js')(runtime)
var ItemTemplate = require('./templates/item.html.js')(runtime)

module.exports = {
  list: new ListTemplate(),
  item: new ItemTemplate()
}
