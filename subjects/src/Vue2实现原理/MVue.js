class MVue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.$options = options
    if (this.$el) {
      // 编译模板指令
      new Compiler(this.$el, this)
      // 数据代理 vm.a -> vm.$data.a
      this.proxyData(this.$data)
      new Observer(this.$data)
      // 

    }
  }
  proxyData(data) {
    Object.keys(data).forEach(key => {
      const val = data[key]
      Object.defineProperty(this, key, {
        configurable: false,
        enumerable: true,
        get() {
          return data[key]
        },
        set(newVal) {
          if (newVal === val) return
          data[key] = newVal
        }
      })
    })
  }
}

