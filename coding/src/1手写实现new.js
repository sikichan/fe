/*
  首先要明白new 构造函数() 的时候发生了什么？
  1. 内存中创建一个新对象
  2. 新对象的内部特性[[prototype]] 被赋值为构造函数的prototype
  3. 构造函数的this指向这个新对象
  4. 执行构造函数的代码
  5. 返回 = 构造函数返回非空对象 ? 这个非空对象 : 创建的新对象
*/

/**
 * @param ClassName 类名
 */
export function create(ClassName, ...rest) {
  // 1\2\3
  let obj = Object.create(ClassName.prototype)
  // 4
  let result = ClassName.apply(obj, rest)
  // 5 null\undefined are not instances of Object
  return result instanceof Object ? result : obj
}