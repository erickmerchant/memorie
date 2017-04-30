const ift = require('@erickmerchant/ift')('')
const scrollIntoView = require('scroll-into-view')
const preventDefault = require('prevent-default')
const html = require('bel')
const history = require('../history')

module.exports = function ({dispatch, next}, task) {
  const request = require('../request')(dispatch)

  next(function ({target}) {
    const form = target.querySelector('form')
    const input = target.querySelector('input')

    scrollIntoView(form)

    if (input) {
      input.focus()

      input.value = input.value
    }
  })

  return html`<form class="left-align col col-12 bg-silver p2" onsubmit=${preventDefault(task ? save : create)}>
    <div class="black max-width-2 mx-auto">
      <label class="block my2">
        <input class="p1 input bold" type="text" placeholder="Untitled" name="title" value="${ift(task, () => task.title)}" onkeyup=${exit} />
      </label>
      <div class="mb1 right-align">
        ${ift(task, () => html`<span class="px1"><button class="btn btn-primary bg-fuchsia" type="button" onclick=${remove}><i class="icon-cross pr1"></i> Delete</button></span>`)}
        <span class="px1"><button class="btn btn-primary bg-maroon" type="submit"><i class="icon-checkmark pr1"></i> Save</button></span>
      </div>
    </div>
  </form>`

  function exit (e) {
    if (e.keyCode === 27) {
      history.push('/', {})
    }
  }

  function create (e) {
    history.push('/', {})

    const title = this.title.value

    request('/api/tasks', {
      method: 'post',
      body: {title}
    }).then((id) => {
      dispatch('tasks', 'save', {id, title})
    })
  }

  function save (e) {
    history.push('/', {})

    const title = this.title.value
    const id = task.id

    request('/api/tasks/' + id, {
      method: 'put',
      body: {title}
    }).then(() => {
      dispatch('tasks', 'save', {id, title})
    })
  }

  function remove (e) {
    history.push('/', {})

    const id = task.id

    request('/api/tasks/' + id, {method: 'delete'}).then(() => {
      dispatch('tasks', 'remove', {id})
    })
  }
}
