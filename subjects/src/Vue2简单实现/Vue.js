/*
  new Vue()做的事情
  数据代理 _proxyData vm.xx -> vm._data.xx
  初始化计算属性 _initComputed()
  数据绑定 observe()
  模板分析 new Compiler
*/

function Vue(options) {
  this.$options = options
  this._data = options.data
  this._proxyData()
  this._initComputed()
  observe(this._data)
  new Compiler(this.$options.el, this)
}

Vue.prototype = {
  constructor: Vue,
  _proxyData: function() {
    Object.keys(this._data).forEach(key => {
      let val = this._data[key]
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get: function() {
          return val
        },
        set: function(newVal) {
          if (newVal === val) return
          this._data[key] = newVal
        }
      })
    })
  },
  /*
  computed: {
    msg: { 对象时
      get: function() {},
      set: function(newVal) {

      }
    },
    header() { 函数时

    }
  }
  */
  _initComputed: function () {
    const computed = this.$options.computed
    if (computed && typeof computed === 'object') {
      Object.keys(computed).forEach(key => {
        Object.defineProperty(computed, key, {
          configurable: false,
          enumerable: true,
          get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
          set: computed[key].set || function () {}
        })
      })
    }
  }
}

