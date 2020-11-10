const CompileUtil = {
  getExprVal(vm, expr) {
    return expr.split('.').reduce((pre, cur) => {
      return pre[cur]
    }, vm)
  },
  setExprVal(vm, expr, val) {
    expr.split('.').reduce((pre, cur) => {
      pre[cur] = val
    }, vm)
  },
  removeDir(node, directive, propName) {
    const attrName = propName ? `v-${directive}:${propName}`: `v-${directive}`
    node.removeAttribute(attrName)
  },
  text(node, expr, vm) {
    const value = this.getExprVal(vm, expr)
    new Watcher(vm, expr, (newVal) => {
      this.updater.textUpdater(node, newVal)
    })
    this.updater.textUpdater(node, value)
    this.removeDir(node, 'text')
  },
  getContentVal(vm, expr) {
    return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
      return this.getExprVal(vm, args[1])
    })
  },
  textcontent(node, vm) {
    // todo: 整理思路重新写
    // let value
    let value = node.textContent
    let result = value.replace(/\{\{(.+?)\}\}/g, (...args) => {
      new Watcher(vm, args[1], () => {
        this.updater.textUpdater(node, this.getContentVal(vm, value))
      })
      return this.getExprVal(vm, args[1])
    })
    this.updater.textUpdater(node, result)
  },
  html(node, expr, vm) {
    const value = this.getExprVal(vm, expr)
    new Watcher(vm, expr, (newVal) => {
      this.updater.htmlUpdater(node, newVal)
    })
    this.updater.htmlUpdater(node, value)
    this.removeDir(node, 'html')
  },
  model(node, expr, vm) {
    const value = this.getExprVal(vm, expr)
    node.value = value
    new Watcher(vm, expr, (newVal) => {
      this.updater.modelUpdater(node, newVal)
    })
    node.addEventListener('input', (e) => {
      this.setExprVal(vm, expr, e.target.value)
    })
  },
  bind(node, expr, vm, propName) {
    // v-bind:id="uid"
    const value = this.getExprVal(vm, expr)
    this.updater.bindUpdater(node, propName, value)
    this.removeDir(node, 'bind', propName)
  },
  on(node, expr, vm, eventName) {
    // v-on:click="handler"
    node.addEventListener(eventName, vm.$options.methods[expr].bind(vm))
    this.removeDir(node, 'on', eventName)
  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },
    modelUpdater(node, value) {
      node.value = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    bindUpdater(node, propName, value) {
      node.setAttribute(propName, value)
    }
  }
}

class Compiler {
  constructor(el, vm) {
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    const fragment = this.nodeToFragment(this.el)
    this.compile(fragment)
    this.el.appendChild(fragment)
  }
  nodeToFragment(el) {
    const fragment = document.createDocumentFragment()
    let firstChild
    while(firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment
  }
  isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE
  }
  isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE
  }
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  compile(fragment) {
    const childNodes = fragment.childNodes
    childNodes.forEach(node => {
      if (this.isElementNode(node)) {
        this.compileElement(node)
      } else if (this.isTextNode(node)) {
        this.compileTextContent(node)
      }
      if (node.childNodes && node.childNodes.length) {
        this.compile(node) // 递归编译每个子节点
      }
    })
  }
  compileElement(node) {
    // 检查attributes有没有指令
    [...node.attributes].forEach(attr => {
      const attrName = attr.name
      // v-text="msg" v-on:click="handle"
      if (this.isDirective(attrName)) {
        const [, dir] = attrName.split('v-')
        const [directive, propName] = dir.split(':')
        CompileUtil[directive](node, attr.value, this.vm, propName)
        // node.removeAttributeNode(attr)
      }
    })
  }
  compileTextContent(node) {
    console.log(`文本: ${node.textContent}`)
    // CompileUtil['text'](node, expr, this.vm) // {{user.name}}
    CompileUtil['textcontent'](node, this.vm)
    // {{user.name}} -- {{user.age}}
    // node.textContent = node.textContent.replace(/\{\{(.+?)\}\}/g, (...args) => {
    //   const expr = args[1].trim()
    //   console.log(`表达式：${expr};; content: ${node.textContent}`)
    //   CompileUtil['text'](node, expr, this.vm) // {{user.name}}
    // })
    
  }
}
class Dep {
  constructor() {
    this.subs = []
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  removeSub(watcher) {
    // const idx = this.subs.indexOf(watcher)
    // return this.subs.splice(idx, 1)
  }
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    this.oldVal = this.getOldVal()
  }
  getOldVal() {
    Dep.target = this
    let oldVal = CompileUtil.getExprVal(this.vm, this.expr)
    Dep.target = null
    return oldVal
  }
  update() {
    const newVal = CompileUtil.getExprVal(this.vm, this.expr)
    if (newVal !== this.oldVal) {
      // console.log(`newVal: ${newVal}, oldVal: ${this.oldVal}`)
      // 数据更新了
      this.cb(newVal, this.oldVal)
    }
  }
}
