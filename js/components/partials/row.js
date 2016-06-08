module.exports = function (task, app) {
  var {hx} = app

  return hx`<a class="col col-12 p2 center border-top border-bottom border-silver block black" href="/edit/${task.id}">${task.title || 'untitled'}</a>`
}
