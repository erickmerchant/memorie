module.exports = function (state, app) {
  var {hx} = app

  return hx`<div class="fixed flex top-0 left-0 bottom-0 right-0 bg-maroon"><img src="/loading.svg" class="flex-center mx-auto"></div>`
}
