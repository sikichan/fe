/*
  首先要清晰apply方法的功能和特点：
  1. fn.apply(targetThis, arr)
  2. 如果targetThis是null或者undefined，就会忽略掉，原始类型会转成对象
  3. this指向调用apply的函数，改成指向targetThis
  4. 箭头函数的this不能被apply改变
*/

/**
 * es6 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.applyFn = function (context, arr) {
  // 1\2
  context = context || globalThis
  let fn = Symbol.for('fn')
  // 3 this指向的是调用applyFn的函数
  context[fn] = this
  if (!arr) {
    return context[fn]()
  }
  let res = context[fn](...arr)
  delete context[fn]
  return res
}

/**
 * es5 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.applyFn2 = function (context, arr) {
  function getFn (context) {
    var fn = 'fn'
    while (context.hasOwnProperty(fn)) {
      fn = 'fn' + Math.random()
    }
    return fn
  }
  context = context || globalThis
  var fn = getFn(context)
  context[fn] = this
  if (!arr) {
    return context[fn]()
  }
  var args = []
  for (var i = 0; i < arr.length; i++) {
    args.push('arr[' + i + ']')
  }
  var execution = 'context[fn](' + args.join(',') + ')'
  var res = eval(execution)
  delete context[fn]
  getFn = null
  return res
}