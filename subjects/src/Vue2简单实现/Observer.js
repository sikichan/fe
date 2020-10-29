function observe(obj) {
  if (!obj || typeof obj !== 'object') return
  console.log('ojb===', obj)
  return new Observer(obj)
}

function Observer (value) {
  if (Array.isArray(value)) {
    value.forEach(v => observe(v))
  } else {
    this.walk(value)
  }
}

function defineReactive(obj, key, val) {
  observe(val) // 递归监听所有属性
  Object.defineProperty(obj, key, {
    configurable: false,
    enumerable: true,
    get: function() {
      return val
    },
    set: function(newVal) {
      if (newVal === val) return
      val = newVal
      obj[key] = newVal
      observe(newVal)
    }
  })
}

Observer.prototype = {
  constructor: Observer,
  walk: function(obj) {
    let keys = Object.keys(obj)
    keys.forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}