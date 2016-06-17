const framework = require('@erickmerchant/framework')
const reducers = {
  errors: require('./reducers/errors'),
  fetchingCount: require('./reducers/fetching-count'),
  isLoading: require('./reducers/is-loading'),
  tasks: require('./reducers/tasks')
}
const components = {
  index: require('./components/index'),
  create: require('./components/create'),
  edit: require('./components/edit'),
  unfound: require('./components/unfound')
}
const routes = {
  '': components.index,
  'create': components.create,
  'edit/:id': components.edit
}
const target = document.querySelector('main')
const defaultComponent = components.unfound

framework({reducers, routes, defaultComponent, target})
