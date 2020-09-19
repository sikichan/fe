import {expect} from 'chai'
import './4手写实现bind.js'

let f = Math.max.bindFn2({}, 35, '59',6)
console.log(f())

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
sayHi.bindFn2(obj, 'coder', options)()
obj.info.bindFn2(obj2)()