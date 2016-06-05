const catchLinks = require('catch-links')
const singlePage = require('single-page')
const loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const hx = hyperx(vdom.h)
const redux = require('redux')
const thunk = require('redux-thunk').default

module.exports = function (settings) {
  settings = Object.assign({
    reducers: {},
    routes: [],
    target: document.querySelector('body'),
    defaultComponent: function () {

    },
    middleware: []
  }, settings)

  settings.reducers.context = contextReducer

  settings.middleware.unshift(thunk)

  const store = redux.createStore(redux.combineReducers(settings.reducers), redux.applyMiddleware(...settings.middleware))
  const router = require('@erickmerchant/router')()
  const dispatch = store.dispatch
  const components = new Map()

  settings.routes.forEach(function (route) {
    if (!Array.isArray(route)) {
      components.set(route, settings.defaultComponent)

      router.add(route)
    } else {
      let component = route[1] || settings.defaultComponent

      if (!Array.isArray(route[0])) {
        components.set(route[0], component)

        router.add(route[0])
      } else {
        route[0].forEach(function (route) {
          components.set(route, component)

          router.add(route)
        })
      }
    }
  })

  const show = singlePage(function (href) {
    var context = router.match(href)

    dispatch({type: 'SET_CONTEXT', context})
  })

  catchLinks(window, show)

  const mainLoop = require('main-loop')

  const loop = mainLoop(store.getState(), function (state) {
    const component = components.get(state.context.route)

    return component(state, {dispatch, show, hx})
  }, loopOptions)

  store.subscribe(function () {
    loop.update(store.getState())
  })

  settings.target.appendChild(loop.target)
}

function contextReducer (state = {route: '', params: {}}, action) {
  if (action.type === 'SET_CONTEXT') {
    return action.context
  }

  return state
}
