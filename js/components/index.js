const ift = require('@erickmerchant/ift')('')
const rows = require('./rows')
const spinner = require('./spinner')
const html = require('yo-yo')

module.exports = function (app, main = defaultMain) {
  const {state, dispatch} = app

  return html`<main>
    <div class="flex items-center clearfix white bg-maroon p2 bold">
      <div class="col-4 left-align">
        <a class="white h3" href="/">Memorie</a>
      </div>
      <div class="flex-auto justify-center items-center flex">
        ${ift(state.fetchingCount > 0, () => spinner(app, 20))}
      </div>
      <div class="col-4 right-align">
        <a class="white" href="/create"><i class="icon-plus pr1"></i> Add</a>
      </div>
    </div>
    <div class="flex flex-column-reverse">
      ${ift(state.errors, (error) => html`
        <div class="clearfix flex items-center m1 p2 bg-fuchsia white">
          <div class="col col-11">${error.message}</div>
          <div class="col col-1 right-align">
            <button class="btn" onclick=${removeError(error)}><i class="icon-cross"></i></button>
          </div>
        </div>
      `)}
    </div>
    <div class="flex flex-column-reverse">
      ${main(app)}
    </div>
  </main>`

  function removeError (error) {
    return function () {
      dispatch('errors', 'remove', error)
    }
  }
}

function defaultMain (app) {
  return rows(app)
}
