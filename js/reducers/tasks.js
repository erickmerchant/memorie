const POPULATE = Symbol()
const ADD = Symbol()
const SAVE = Symbol()
const REMOVE = Symbol()

function tasks (state = [], action) {
  if (action.type === POPULATE) {
    return action.tasks
  }

  if (action.type === ADD) {
    state.unshift(action.task)
  }

  if (action.type === SAVE) {
    state = state.map(function (task) {
      if (task.id === action.task.id) {
        return action.task
      }

      return task
    })
  }

  if (action.type === REMOVE) {
    state = state.filter(function (task) {
      return task.id !== action.id
    })
  }

  return state
}

tasks.populate = function (tasks) {
  return { type: POPULATE, tasks }
}

tasks.add = function (task) {
  return { type: ADD, task }
}

tasks.save = function (task) {
  return { type: SAVE, task }
}

tasks.remove = function (id) {
  return { type: REMOVE, id }
}

module.exports = tasks
