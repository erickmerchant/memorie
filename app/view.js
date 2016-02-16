const main = document.querySelector('main')
import riot from 'riot'

export default function (tag, data) {
  var data = {}

  return function (id) {
    if (id) {
      data.id = id
    }

    main.innerHTML = '<' + tag + '></' + tag + '>'

    riot.mount(tag, data)

    riot.update()
  }
}
