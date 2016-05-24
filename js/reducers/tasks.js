module.exports = function (state = [], action) {
  if (action.type === 'POPULATE_TASKS') {
    return action.tasks
  }

  if (action.type === 'ADD_TASK') {
    state.unshift(action.task)
  }

  if (action.type === 'SAVE_TASK') {
    state = state.map(function (task) {
      if (task.id === action.task.id) {
        return action.task
      }

      return task
    })
  }

  if (action.type === 'REMOVE_TASK') {
    state = state.filter(function (task) {
      return task.id !== action.id
    })
  }

  return state
}
