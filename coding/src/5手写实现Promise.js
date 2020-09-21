class Promise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  // executor 执行器，同步执行
  constructor(executor) {
    this.status = Promise.PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCbs = []
    this.onRejectedCbs = []
    try {
      executor(this._resolve.bind(this), this._reject.bind(this))
    } catch (error) {
      this._reject(error)
    }
  }

  _resolve(value) {
    // 异步的
    setTimeout(()=>{
      if (this.status === Promise.PENDING) {
        this.status = Promise.FULFILLED
        this.value = value
        this.onFulfilledCbs.forEach(f => f(value))
      }
    })
  }
  _reject(reason) {
    setTimeout(()=>{
      if (this.status === Promise.PENDING) {
        this.status = Promise.REJECTED
        this.reason = reason
        this.onRejectedCbs.forEach(r => r(reason))
      }
    })
  }

  /**
   * 注册回调，状态改变后执行回调
   * @param {Function} onFulfilled 成功态回调
   * @param {Function} onRejected 失败态回调
   */
  then(onFulfilled, onRejected) {
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : v => v
    onRejected = isFunction(onRejected) ? onRejected : r => {throw r}
    let promise2 = new Promise((resolve, reject) => {
      if (this.status === Promise.PENDING) {
        if (isFunction(onFulfilled)) {
          this.onFulfilledCbs.push((value) => {
              try {
                let x = onFulfilled(value);
                resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
        }
        
        if (isFunction(onRejected)) {
          this.onRejectedCbs.push((reason) => {
              try {
                let x = onRejected(reason)
                resolvePromise(promise2, x, resolve, reject)
              } catch (error) {
                reject(error)
              }
            })
        }
      }
      if (this.status === Promise.FULFILLED) {
        // 保证onFulfilled是异步执行
        if (isFunction(onFulfilled)) {
          setTimeout(()=>{
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        }
        
      }
      if (this.status === Promise.REJECTED) {
        if (isFunction(onRejected)) {
          setTimeout(()=>{
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })        
        }
      }
    })
    return promise2

  }

}

function isFunction(f) {
  return typeof f === 'function'
}

  /**
 * 根据上一个then的结果执行Promise
 * @param {Object} promise2 新Promise对象
 * @param {Object} x 上一个then的返回值
 * @param {Function} resovle 新Promise的成功态回调
 * @param {Function} reject 新Promise的失败态回调
 * promise2 = promise.then(onFulfilled, onRejected)
 */
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) reject(new TypeError('循环引用'))
  let called = false // onFulfilled,onRejected 调用标记，只能调用一次
  if (x !== null && (typeof x === 'object' || isFunction(x))) {
  // if (x instanceof Object || isFunction(x)) { 
  // 此处不能用 x instanceof Object, 因为 Object.create(null) instanceof Object 返回false
    try {
      let then = x.then
      if (isFunction(then)) {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}
module.exports = Promise

/**
 * 测试代码
 * yarn add promises-aplus-tests --dev
 * package.json
 * "scripts": {"test": "promises-aplus-tests src/5手写实现Promise.js"}
 * 运行测试: yarn test
 */
Promise.defer = Promise.deferred = function () {
  var dfd = {}
  dfd.promise = new Promise((resolve, reject) => {
      dfd.resolve = resolve
      dfd.reject = reject
  })
  return dfd
}

