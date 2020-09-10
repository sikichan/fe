function fn () {
  console.log(this, arguments)
  return function() {
    console.log(name)
  }
}

let name = 'win'

let obj = {name: 'siki'}
let t = new String('')
console.log(t, t.toString)
fn.call(undefined, 33,232)()

console.log('globalThis:', globalThis)