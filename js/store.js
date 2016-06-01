const redux = require('redux')
const thunk = require('redux-thunk').default
const reducers = {
  context: require('./reducers/context.js'),
  errors: require('./reducers/errors.js'),
  fetchingCount: require('./reducers/fetching-count.js'),
  isLoading: require('./reducers/is-loading.js'),
  tasks: require('./reducers/tasks.js')
}

module.exports = redux.createStore(redux.combineReducers(reducers), redux.applyMiddleware(thunk))
