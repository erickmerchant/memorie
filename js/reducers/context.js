module.exports = function (routes) {
  const router = require('@erickmerchant/router')()

  routes.forEach(function (route) {
    router.add(route)
  })

  return function (state = {params: {}, route: ''}, action) {
    if (action.type === 'CHANGE_LOCATION') {
      return router.match(action.href)
    }

    return state
  }
}
