import {curry, curry2} from './6手写柯里化函数.js'

const list1 = [
  {nickname: '甄姬', profession: '法师'},
  {nickname: '孙悟空', profession: '刺客'},
  {nickname: '程咬金', profession: '坦克'},
  {nickname: '后羿', profession: '射手'}
]

const list2 = [
  {name: '妲己', profession: '法师'},
  {name: '赵云', profession: '刺客'},
  {name: '廉颇', profession: '坦克'},
  {name: '鲁班七号', profession: '射手'}
]


function getName (name, element) {
  return element[name]
}

function sum (a, b, c) {
  return a + b + c
}
let c1 = curry(getName)

console.log(list1.map(c1('nickname')))
console.log(list2.map(c1('name')))
console.log(list1.map(c1('profession')))

let add = curry2(sum)
console.log(add(1,2,3,4))