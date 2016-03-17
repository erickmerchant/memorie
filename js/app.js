var framework = require('./framework')('main')

framework.redirect('/', '/clicccck/123')

framework.route('/clicccck/:id', function (params) {
  console.log(params)
})
