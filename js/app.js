const framework = require('./framework.js')
const view = require('./view.js')
const redux = require('redux')
const thunk = require('redux-thunk').default
const reducers = {
  location: require('./reducers/location.js'),
  errors: require('./reducers/errors.js'),
  fetchingCount: require('./reducers/fetching-count.js'),
  isLoading: require('./reducers/is-loading.js'),
  tasks: require('./reducers/tasks.js')
}
const store = redux.createStore(redux.combineReducers(reducers), redux.applyMiddleware(thunk))
const dispatch = store.dispatch
const loop = framework(store, function (location) {
  dispatch({type: 'SET_LOCATION', location})
}, view)

document.querySelector('main').appendChild(loop.target)
