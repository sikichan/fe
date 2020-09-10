/*
  首先要清晰bind方法的功能和特点：
  1. fn.bind(targetThis, ...args)
  2. 如果targetThis是null或者undefined，就会忽略掉，原始类型会转成对象
  3. this指向调用bind的函数，改成指向targetThis
  4. 箭头函数的this不能被bind改变
  5. 不是自动执行，而是返回一个绑定后的函数
*/

/**
 * es6 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.bindFn = function (context, ...args) {
  context = context || globalThis
  let fn = Symbol.for('fn')
  context[fn] = this
  return (() => {
    return context[fn](...args)
  })
}

/**
 * es5 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.bindFn2 = function (context) {
  if (typeof this !== 'function') {
    throw new Error('被绑定的不是函数，不能调用')
  }
  function getFn(context) {
    var uniqueFn = 'fn'
    while (context.hasOwnProperty(uniqueFn)) {
      uniqueFn = 'fn' + Math.random()
    }
    return uniqueFn
  }
  context = context || globalThis
  var fn = getFn(context)
  context[fn] = this
  var args = []
  // 此处使用arguments容易踩坑，后面返回的函数如果直接访问arguments，访问的不是这里的argsArr
  var argsArr = arguments
  for (var i = 1; i < argsArr.length; i++) {
    args.push('argsArr[' + i + ']')
  }
  return function () {
    var execution = 'context[fn](' + args.join(',') + ')'
    var res = eval(execution)
    delete context[fn]
    getFn = null
    return res
  }
}