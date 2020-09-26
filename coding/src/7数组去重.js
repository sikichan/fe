export function unique1(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  return [...new Set(arr)]
}

export function unique2(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  return Array.from(new Set(arr))
}
// 过滤第一个出现索引等于当前索引的元素
export function unique3(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  return arr.filter((item, index, array) => array.indexOf(item) === index)
}
// use reduce
export function unique4(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  return arr.reduce((pre, cur) => pre.includes(cur) ? pre : [...pre, cur], [])
}

// use sort & for 
export function unique5(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  arr = arr.sort()
  let array = [arr[0]]
  for(let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i-1]) array.push(arr[i])
  }
  return array
}

// use includes & for
export function unique6(arr) {
  if (!Array.isArray(arr)) throw new TypeError(`参数必须是数组`)
  let array = []
  for(let i = 0; i < arr.length; i++) {
    if (!array.includes(arr[i])) array.push(arr[i])
  }
  return array
}
