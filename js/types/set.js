module.exports = class {
  constructor (data = []) {
    this.list = new Set([...data])
  }

  set (data) {
    this.list.add(data)
  }

  delete (data) {
    this.list.delete(data)
  }

  size () {
    return this.list.size
  }

  map (callback) {
    return [...this.list.values()].reverse().map(callback)
  }
}
