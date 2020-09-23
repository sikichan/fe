/**
 * 思路：
 * 1. RegExp,Date类型返回的处理，Symbol属性不要漏掉
 * 2. 递归
 * 3. 用 WeakMap 解决循环引用
 * 4. 忽略掉原型上的属性
 * @param {}} obj 
 */
function cloneDeep(obj, map = new WeakMap()) {
  if (!obj || typeof obj !== 'object') return obj
  if (map.has(obj)) return map.get(obj)
  if (typeof obj === 'function') return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  const keys = Reflect.ownKeys(obj)
  const target = Array.isArray(obj) ? [] : {}
  map.set(obj, target)
  for (let k of keys) {
    target[k] = cloneDeep(obj[k], map)
  }
  return target
}

let obj = {b: 'obj'}
let tj = {obj}
obj.tj = tj // 循环引用
function f() {}
let arr = [{a: obj, f}, {i: tj}]
let cp = cloneDeep(arr)
obj.b = 'hello'
console.log(cp)
