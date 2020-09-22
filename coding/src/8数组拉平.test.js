require('./8数组拉平.js')
import {expect} from 'chai'
let arr = [[3,4], 5,[9, 'hello', [2, [{a: 'b'}, [3,5,7,8]]], [8,9]]]

expect(arr.flatArray(0).length).to.be.equal(arr.flat(0).length)
expect(arr.flatArray(1).length).to.be.equal(arr.flat(1).length)
expect(arr.flatArray(2).length).to.be.equal(arr.flat(2).length)
expect(arr.flatArray(3).length).to.be.equal(arr.flat(3).length)
expect(arr.flatArray(Infinity).length).to.be.equal(arr.flat(Infinity).length)