const fetch = require('simple-fetch')
const scrollIntoView = require('scroll-into-view')
const redux = require('redux')
const vdom = require('virtual-dom')
const hyperx = require('hyperx')
const mainLoop = require('main-loop')
const catchLinks = require('catch-links')
const singlePage = require('single-page')
const reducers = {
  context: require('./reducers/context.js')(['', 'edit/:id', 'create']),
  errors: require('./reducers/errors.js'),
  fetchingCount: require('./reducers/fetching-count.js'),
  isLoading: require('./reducers/is-loading.js'),
  tasks: require('./reducers/tasks.js')
}
const loopOptions = {
  create: require('virtual-dom/create-element'),
  diff: require('virtual-dom/diff'),
  patch: require('virtual-dom/patch')
}
const hx = hyperx(vdom.h)
const store = redux.createStore(redux.combineReducers(reducers))
const loop = mainLoop(store.getState(), view, loopOptions)
const dispatch = store.dispatch
const show = singlePage(function (href) {
  dispatch({type: 'CHANGE_LOCATION', href})
})

store.subscribe(function () {
  loop.update(store.getState())
})

catchLinks(window, show)

document.querySelector('main').appendChild(loop.target)

fetch.getJson('/api/tasks')
.then(function (tasks) {
  dispatch({type: 'LOADED'})

  dispatch({ type: 'POPULATE_TASKS', tasks })
})
.catch(function (error) {
  dispatch({type: 'LOADED'})

  dispatch({type: 'ADD_ERROR', error})
})

function view (state) {
  if (state.isLoading) {
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
    if (state.context.route === 'create') {
      return form()
    }

    return ''
  }

  function row (task) {
    if (state.context.route === 'edit/:id' && task.id === parseInt(state.context.params.id)) {
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
}

function create () {
  return function (e) {
    e.preventDefault()

    show('/')

    dispatch({ type: 'INCREMENT_FETCHING_COUNT' })

    var title = this.title.value

    fetch.postJson('/api/tasks', {
      title
    })
    .then(function (task) {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({ type: 'ADD_TASK', task: {
        id: task.id,
        title
      }})
    })
    .catch(function (error) {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}

function edit (id) {
  return function (e) {
    e.preventDefault()

    show('/')

    dispatch({ type: 'INCREMENT_FETCHING_COUNT' })

    var title = this.title.value

    fetch.putJson('/api/tasks/' + id, {
      title
    })
    .then(function (task) {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({ type: 'SAVE_TASK', task: {
        id: task.id,
        title
      }})
    })
    .catch(function (error) {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}

function remove (id) {
  return function (e) {
    e.preventDefault()

    show('/')

    dispatch({ type: 'INCREMENT_FETCHING_COUNT' })

    fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({ type: 'REMOVE_TASK', id })
    })
    .catch(function (error) {
      dispatch({ type: 'DECREMENT_FETCHING_COUNT' })

      dispatch({type: 'ADD_ERROR', error})
    })
  }
}
