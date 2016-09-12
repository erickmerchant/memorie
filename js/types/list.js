module.exports = class {
  constructor (data = []) {
    this.list = new Map()
  }

  initialize (data) {
    this.list = new Map([...data.reverse()])
  }

  set (id, data) {
    this.list.set(id, data)
  }

  delete (id) {
    this.list.delete(id)
  }

  size () {
    return this.list.size
  }

  map (callback) {
    return [...this.list.values()].reverse().map(callback)
  }
}
