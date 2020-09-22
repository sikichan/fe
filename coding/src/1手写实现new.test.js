import {create} from '../src/1手写实现new.js'
import {expect} from 'chai'
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
    return Object.create(null)
    // return {}
  }
  sayHello() {
    console.log('hello to ' + this.name)
  }
}

let p = create(Person, 'SikiChan', 25)
let p1 = new Person('Sk', 22)
console.log(p, p1)
// expect(p.constructor).to.be.a('function')
expect(JSON.stringify(p)).to.be.equal(JSON.stringify(p1))
// expect(p.__proto__).to.be.equal(p1.__proto__)
// expect(p).to.be.have.property('__proto__')