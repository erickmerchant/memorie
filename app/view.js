const main = document.querySelector('main')
import riot from 'riot'

export default function (tag, data) {
  main.innerHTML = '<' + tag + '></' + tag + '>'

  riot.mount(tag, data)

  riot.update()
}
