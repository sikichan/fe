/*
  首先要清晰call方法的功能和特点：
  1. fn.call(targetThis, ...args)
  2. 如果targetThis是null或者undefined，就会忽略掉，原始类型会转成对象
  3. this指向调用call的函数，改成指向targetThis
  4. 箭头函数的this不能被call改变
*/

/**
 * es6 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.callFn = function (context, ...rest) {
  // 1\2
  context = context || globalThis
  // 因为是函数fn调用的call方法，所以this指向的是函数fn
  // 3 拿到fn
  let fn = Symbol.for('fn')
  context[fn] = this
  let result = context[fn](...rest)
  delete context[fn]
  return result
}

/**
 * es5 实现
 * @param context 调用函数的上下文对象
 */
Function.prototype.callFn2 = function (context) {
  function getFn(context) {
    var uniqueFn = 'fn'
    while (context.hasOwnProperty(uniqueFn)) {
      uniqueFn = 'fn' + Math.random()
    }
    return uniqueFn
  }
  // 1\2
  context = context || globalThis
  // 因为是函数fn调用的call方法，所以this指向的是函数fn
  // 3 拿到fn
  var fn = getFn(context)
  console.log('fn: ', fn)
  context[fn] = this
  var args = []
  for (var i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  var execution = 'context[fn](' + args.join(',') + ')'
  var res = eval(execution)
  delete context[fn]
  getFn = null
  return res
}