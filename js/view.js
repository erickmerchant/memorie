const hx = require('./framework.js').hx
const actionCreators = require('./action-creators.js')
const scrollIntoView = require('scroll-into-view')

const router = require('@erickmerchant/router')(['', 'create', 'edit/:id'])

module.exports = function (state, {dispatch, show}) {
  var context = router.match(state.location)

  if (state.isLoading) {
    process.nextTick(function () {
      dispatch(actionCreators.init())
    })

    return hx`<div class="fixed flex top-0 left-0 bottom-0 right-0 bg-maroon"><img src="/loading.svg" class="flex-center mx-auto"></div>`
  }

  process.nextTick(function () {
    var form = document.querySelector('form')
    var input = document.querySelector('input')

    if (form) {
      scrollIntoView(form)
    }

    if (input) {
      input.focus()
    }
  })

  return hx`<div>
    <div class="flex white bg-maroon p2 bold">
      <a class="white h3" href="/">Memorie</a>
      <span class="flex-auto center">
        ${fetchCount()}
      </span>
      <a class="white self-center" href="/create">Add</a>
    </div>
    ${state.errors.map(alert)}
    ${createForm()}
    ${state.tasks.map(row)}
  </div>`

  function fetchCount () {
    if (state.fetchingCount > 0) {
      return hx`<img src="/loading.svg" style="height: 20px">`
    }

    return ''
  }

  function alert (error) {
    return hx`<div class="block m1 p2 bg-fuchsia white">${error.message}</div>`
  }

  function createForm () {
    if (context.route === 'create') {
      return form()
    }

    return ''
  }

  function row (task) {
    if (context.route === 'edit/:id' && task.id === parseInt(context.params.id)) {
      return form(task)
    }

    return hx`<a class="col col-12 p2 center border-bottom border-silver block black" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
  }

  function form (task) {
    return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? edit(task.id) : create()}>
      <div class="black pb2 max-width-2 mx-auto">
        <label class="block my2">
          <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
        </label>
        <div class="inline-block mr1 mb1"><button class="btn btn-primary bg-maroon" type="submit">Save</button></div>
        ${task ? hx`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove(task.id)}>Delete</button></div>` : ''}
      </div>
    </form>`
  }

  function create () {
    return function (e) {
      e.preventDefault()

      show('/')

      var title = this.title.value

      dispatch(actionCreators.createTask(title))
    }
  }

  function edit (id) {
    return function (e) {
      e.preventDefault()

      show('/')

      var title = this.title.value

      dispatch(actionCreators.editTask(id, title))
    }
  }

  function remove (id) {
    return function (e) {
      e.preventDefault()

      show('/')

      dispatch(actionCreators.removeTask(id))
    }
  }
}
