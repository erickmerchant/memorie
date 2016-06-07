const framework = require('./framework.js')
const reducers = {
  errors: require('./reducers/errors.js'),
  fetchingCount: require('./reducers/fetching-count.js'),
  isLoading: require('./reducers/is-loading.js'),
  tasks: require('./reducers/tasks.js')
}
const components = {
  index: require('./components/index.js'),
  create: require('./components/create.js'),
  edit: require('./components/edit.js'),
  unfound: require('./components/unfound.js')
}
const routes = {
  '': components.index,
  'create': components.create,
  'edit/:id': components.edit
}
const target = document.querySelector('main')
const defaultComponent = components.unfound

framework({reducers, routes, defaultComponent, target})
