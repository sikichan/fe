const CompileUtil = {
  getExprVal(vm, expr) {
    return expr.split('.').reduce((pre, cur) => {
      return pre[cur]
    }, vm.$data)
  },
  text(node, expr, vm, mustacheExpr) {
    const value = this.getExprVal(vm, expr)
    if (mustacheExpr) {
      this.updater.mustacheUpdater(node, value, mustacheExpr)
    } else {
      this.updater.textUpdater(node, value)
    }
  },
  
  html(node, expr, vm) {
    const value = this.getExprVal(vm, expr)
    this.updater.textUpdater(node, value)
  },
  bind(node, expr, vm) {

  },
  on(node, expr, vm, eventName) {

  },
  updater: {
    textUpdater(node, value) {
      node.textContent = value
    },
    htmlUpdater(node, value) {
      node.innerHTML = value
    },
    mustacheUpdater(node, value, mustacheExpr) {
      console.log(`replace: ${mustacheExpr} with: ${value}`)
      node.textContent = node.textContent.replace(mustacheExpr, value)
    },
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
    return attrName.indexOf('v-') !== -1
  }
  compile(fragment) {
    const childNodes = fragment.childNodes
    childNodes.forEach(node => {
      if (this.isElementNode(node)) {
        console.log('元素：', node)
        this.compileElement(node)
      } else if (this.isTextNode(node)) {
        console.log('文本：', node)
        this.compileText(node)
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
        const [directive, eventName] = dir.split(':')
        console.log('指令：', directive, '事件名：', eventName)
        CompileUtil[directive](node, attr.value, this.vm)
        // node.removeAttributeNode(attr)
      }
    })
  }
  compileText(node) {
    // {{user.name}} -- {{user.age}}
    node.textContent.replace(/\{\{([\.\w\s]+)\}\}/g, (...args) => {
      console.log('expr:',args[1])
      const expr = args[1].trim()
      CompileUtil['text'](node, expr, this.vm, args[0])
    })
    
  }
}

