// async/await 实现
// function step(delay, light) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log(`---${delay} s 后--- ${light} 灯亮`)
//       resolve()
//     }, delay * 1000)
//   })
// }

// async function task() {
//   await step(3, '红')
//   await step(1, '绿')
//   await step(2, '黄')
//   task()
// }

// task()

// promise实现
function step(delay, light) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`---${delay} s 后--- ${light} 灯亮`)
      resolve()
    }, delay * 1000)
  })
}
let task = function() {
  step(3, '红')
  .then(() => step(1, '绿')).then(()=> step(2, '黄')).then(task)
}
task()