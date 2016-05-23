const fetch = require('simple-fetch')
const scrollIntoView = require('scroll-into-view')
const framework = require('./framework.js')
const hx = framework.hx
const reducers = {
  errors: require('./reducers/errors.js'),
  fetchingCount: require('./reducers/fetching-count.js'),
  isLoading: require('./reducers/is-loading.js'),
  tasks: require('./reducers/tasks.js')
}
const app = framework(reducers, view)
const dispatch = app.store.dispatch

app.route('')

app.route('create')

app.route('edit/:id')

document.querySelector('main').appendChild(app.loop.target)

fetch.getJson('/api/tasks')
.then(function (tasks) {
  dispatch(reducers.isLoading.end())

  dispatch(reducers.tasks.populate(tasks))
})
.catch(function (error) {
  dispatch(reducers.isLoading.end())

  dispatch(reducers.errors.add(error))
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
        ${state.fetchingCount > 0 ? hx`<img src="/loading.svg" style="height: 20px">` : ''}
      </span>
      <a class="white self-center" href="/create">Add</a>
    </div>
    ${state.errors.map(alert)}
    ${state.context.route === 'create' ? form() : ''}
    ${state.tasks.map(row)}
  </div>`

  function alert (error) {
    return hx`<div class="block m1 p2 bg-fuchsia white">${error.message}</div>`
  }

  function row (task) {
    if (state.context.route === 'edit/:id' && task.id === parseInt(state.context.params.id)) {
      return form(task)
    }

    return hx`<a class="col col-12 p2 center border-bottom border-silver block black" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
  }

  function form (task) {
    return hx`<form class="left-align col col-12 bg-silver p2" onsubmit=${task ? on(edit(task.id)) : on(create())}>
      <div class="black pb2 max-width-2 mx-auto">
        <label class="block my2">
          <input class="p1 input" type="text" placeholder="Untitled" name="title" value="${task ? task.title : ''}">
        </label>
        <div class="inline-block mr1 mb1"><button class="btn btn-primary bg-maroon" type="submit">Save</button></div>
        ${task ? hx`<div class="inline-block mr1 mb1"><button class="btn btn-primary bg-fuchsia" type="button" onclick=${on(remove(task.id))}>Delete</button></div>` : ''}
      </div>
    </form>`
  }

  function on (func) {
    return function (e) {
      e.preventDefault()

      dispatch(func.bind(this))
    }
  }
}

function create () {
  return function (dispatch) {
    dispatch(reducers.fetchingCount.increment())

    var title = this.title.value

    fetch.postJson('/api/tasks', {
      title
    })
    .then(function (task) {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.tasks.add({
        id: task.id,
        title
      }))

      app.show('/')
    })
    .catch(function (error) {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.errors.add(error))
    })
  }
}

function edit (id) {
  return function (dispatch) {
    dispatch(reducers.fetchingCount.increment())

    var title = this.title.value

    fetch.putJson('/api/tasks/' + id, {
      title
    })
    .then(function (task) {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.tasks.save({
        id: task.id,
        title
      }))

      app.show('/')
    })
    .catch(function (error) {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.errors.add(error))
    })
  }
}

function remove (id) {
  return function (dispatch) {
    dispatch(reducers.fetchingCount.increment())

    fetch.deleteJson('/api/tasks/' + id)
    .then(function () {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.tasks.remove(id))

      app.show('/')
    })
    .catch(function (error) {
      dispatch(reducers.fetchingCount.decrement())

      dispatch(reducers.errors.add(error))
    })
  }
}
