class MVue {
  constructor(options) {
    this.$el = options.el
    this.$data = options.data
    this.$options = options
    if (this.$el) {
      // 数据代理 vm.a -> vm.$data.a
      this.proxyData(this.$data)
      // 劫持所有属性的setter/getter
      new Observer(this.$data)
      // 编译模板指令
      new Compiler(this.$el, this)
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

