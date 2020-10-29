/*
如果el 存在
  el所有子节点转化为fragment
  编译fragment，插入数据等
  fragment 插入到el
*/
function Compiler (el, vm) {
  this.$vm = vm
  this.$el = this.isElementNode(el) ? el : document.querySelector(el)
  if (this.$el) {
    this.$fragment = this.nodeToFragment(this.$el)
    this.init()
    this.$el.appendChild(this.$fragment)
  }
}

Compiler.prototype = {
  constructor: Compiler,
  nodeToFragment: function(el) {
    let fragment = new DocumentFragment()
    let child = el.firstChild
    while(child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  },
  init: function() {
    this.compile(this.$fragment)
    console.log([this.$fragment])
  },
  compile: function (node) {
    if (node.hasChildNodes()) {
      node.childNodes.forEach(child => {
        console.log('child: ', child)
        this.compile(child)
      })
    }
    let textContent = node.textContent
    let reg = /\{\{(.*)\}\}/
    if (this.isElementNode(node)) {
      this.compileElement(node)
    } else if (this.isTextNode(node) && reg.test(textContent)) {
      console.log('===', textContent)
      this.compileText(node, textContent) 
    }
  },
  compileElement: function(node) {
    for (let attrName of node.getAttributeNames()) {
      let exp = node.getAttribute(attrName)
      console.log(attrName, exp)
      // v-attr  exp
      let directive = attrName.split('v-')[1]
      CompileUtil[directive](node, this.$vm, exp)
    }
    
  },
  compileText: function(node, textContent) {
    let reg = /\{\{(.+)\}\}/
    let exp = reg.exec(textContent)[1]  // 拿到捕获组 {{()}} 也就是表达式
    console.log(exp)
    CompileUtil['text'](node, this.$vm, exp)
  },
  isElementNode: function (el) {
    return el.nodeType === Node.ELEMENT_NODE
  },
  isTextNode: function(el) {
    return el.nodeType === Node.TEXT_NODE
  },
}

CompileUtil = {
  text: function(node, vm, exp) {
    node.textContent = this._getVMVal(vm, exp)
  },
  model: function(node, vm, exp) {
    let val = this._getVMVal(vm, exp)
    node.value = val
    let that = this
    // 双向绑定
    node.addEventListener('input', function(e) {
      let newVal = e.target.value
      if (val === newVal) return
      console.log(newVal)
      that._setVMVal(vm, exp, newVal)
    })
  },
  // ['obj', 'a']
  _getVMVal: function(vm, exp) {
    let val = vm
    exp.split('.').forEach((k) => {
      val = val[k]
    })
    console.log(exp, ': ', val)
    return val
  },
  _setVMVal: function(vm, exp, newVal) {
    let val = vm
    exp = exp.split('.')
    exp.forEach((k, i) => {
      if (i < exp.length -1) {
        val = val[k]
      } else {
        val[k] = newVal
      }
    })
  }
}