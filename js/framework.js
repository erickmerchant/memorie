const redux = require('redux')
const createStore = redux.createStore
const applyMiddleware = redux.applyMiddleware
const combineReducers = redux.combineReducers
const thunk = require('redux-thunk').default
const Router = require('@erickmerchant/router')
const catchLinks = require('catch-links')
const singlePage = require('single-page')
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const mainLoop = require('main-loop')
const hx = hyperx(vdom.h)
const loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
const ROUTE = Symbol()

function framework (reducers, view) {
  reducers.context = contextReducer

  var store = createStore(
    combineReducers(reducers),
    applyMiddleware(thunk)
  )
  var routes = new Map()
  var router = Router()
  var loop = mainLoop(store.getState(), view, loopOptions)

  var show = singlePage(function (href) {
    var context = router.match(href)

    store.dispatch({type: ROUTE, context})

    if (context != null && routes.has(context.route)) {
      store.dispatch(routes.get(context.route)(context))
    }
  })

  store.subscribe(update)

  catchLinks(window, show)

  return {
    loop,
    show,
    route,
    store
  }

  function contextReducer (state = {params: {}, route: ''}, action) {
    if (action.type === ROUTE) {
      state = action.context
    }

    return state
  }

  function update () {
    console.log(store.getState())

    loop.update(store.getState())
  }

  function route (route, thunk) {
    if (thunk) {
      routes.set(route, thunk)
    }

    router.add(route)
  }
}

framework.hx = hx

module.exports = framework
