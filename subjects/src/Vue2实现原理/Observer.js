class Observer {
  constructor(data) {
    this.observe(data)
  }

  observe(data) {
    if (data && typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.defineReactive(data, key, data[key])
      })
    }
  }
  defineReactive(obj, key, value) {
    this.observe(value)
    Object.defineProperty(obj, key, {
      configurable: false,
      enumerable: true,
      get() {
        return value
      },
      set: (val) => {
        this.observe(val)
        if (val !== value) {
          value = val
        }
      }
    })
  }
}