/**
 * @param {number} depth 维度
 */
Array.prototype.flatArray = function(d = 1) {
  function flat(arr, d) {
    return Array.isArray(arr) ? d > 0 ? arr.reduce((pre, cur)=> pre.concat(flat(cur, d-1)), []) : arr.slice() : arr
  }
  return flat(this, d)
}
let arr = [[3,4], 5,[9, 'hello', [2, [{a: 'b'}, [3,5,7,8]]], [8,9]]]

