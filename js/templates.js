var runtime = require('./runtime')
var ListTemplate = require('./templates/list.html.js')(runtime)
var FormTemplate = require('./templates/form.html.js')(runtime)

module.exports = {
  list: new ListTemplate(),
  form: new FormTemplate()
}
