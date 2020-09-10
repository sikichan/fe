import '../2手写实现call.js'
import {expect} from 'chai'
let r = Math.max.callFn({}, 35, '59',6)
console.log(r)

function sayHi(job, options) {
  console.log(this.name, this.age, job, options)
}

let obj = {name: 'siki', age: 25, 
info: function() {
  console.log('this is info: ', this.name)
},
info2: () => {
  console.log('arrow function: ', this.name)
}}

let options = {a: 'a', b: 'b'}
let obj2 = {name: 'xyz', age: 11, fn: function() {}}
sayHi.callFn2(obj, 'coder', options)
obj.info.callFn2(obj2)
try {
  // 箭头函数info2 不能通过call来修改this指向
  obj.info2.callFn2(obj2)
} catch (error) {
  expect(error.constructor).to.be.equals(TypeError)
  expect(error.message).to.be.equals(`Cannot read property 'name' of undefined`)
}
