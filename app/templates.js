var runtime = require('./runtime')
var ListTemplate = require('./list.html.js')(runtime)
var ItemTemplate = require('./item.html.js')(runtime)

module.exports = {
  list: new ListTemplate(),
  item: new ItemTemplate()
}
