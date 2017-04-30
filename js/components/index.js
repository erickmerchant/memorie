const ift = require('@erickmerchant/ift')('')
const form = require('./form')
const rows = require('./rows')
const spinner = require('./spinner')
const html = require('bel')
const history = require('../history')
const preventDefault = require('prevent-default')

module.exports = function (app) {
  const {state, dispatch} = app

  if (state.context.route == null) {
    return html`<div class="fixed flex items-center justify-center mx-auto top-0 left-0 bottom-0 right-0 bg-maroon">${spinner({html}, 40)}</div>`
  }

  return html`<main>
    <div class="flex items-center clearfix white bg-maroon p2 bold">
      <div class="col-4 left-align">
        <a class="white h3 p2" href="/" onclick=${preventDefault(function (e) {
          history.push('/', {})
        })}>Memorie</a>
      </div>
      <div class="flex-auto justify-center items-center flex">
        ${ift(state.fetchingCount > 0, () => spinner(app, 20))}
      </div>
      <div class="col-4 right-align">
        <a class="white p2" href="/create" onclick=${preventDefault(function (e) {
          history.push('/create', {})
        })}><i class="icon-plus pr1"></i> Add</a>
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
      ${ift(state.context, (context) => {
        switch (context.route) {
          case 'create':
            return [
              rows(app),
              html`<div id="new">${form(app)}</div>`
            ]
          case 'edit/:id':
            return rows(app, parseInt(context.params.id))
          default:
            return rows(app)
        }
      })}
    </div>
  </main>`

  function removeError (error) {
    return function () {
      dispatch('errors', 'remove', error)
    }
  }
}
