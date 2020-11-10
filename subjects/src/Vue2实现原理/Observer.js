
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
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      configurable: false,
      enumerable: true,
      get() {
        // 一个属性对应一个Dep实例
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set: (newVal) => {
        this.observe(newVal)
        if (newVal !== value) {
          // 数据变化了，通知watcher去update
          console.log('数据变化了，通知watcher去update')
          value = newVal
        }
        dep.notify()
      }
    })
  }
}