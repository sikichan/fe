const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export default class PromiseA{
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.fulfilledCallbacks = []
    this.rejectedCallbacks = []

    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error)
    }

  }

  resolve(value) {
    setTimeout(() => { // 用setTimeout来模拟再下一次轮训再执行回调
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.fulfilledCallbacks.forEach(fulfill => fulfill(value))
      }
    })
  }

  reject(reason) {
    setTimeout(() => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.rejectedCallbacks.forEach(reject => reject(reason))
      }
    })
  }

  // promise.then(onFulfilled, onRejected) 
  // then() 返回的是一个新的Promise对象
  then(onFulfilled, onRejected) {
    let promise = new PromiseA((resolve, reject) => {
      if (typeof onFulfilled !== 'function') { 
        // 如果 onFulfilled 不是函数，它会被忽略
        onFulfilled = () => {
          resolve(this.value)
        }
      }
      if (typeof onRejected !== 'function') {
        // 如果 onRejected 不是函数，它会被忽略
        onRejected = () => {
          reject(this.reason)
        }
      }
      if (this.status === PENDING) {
        this.fulfilledCallbacks.push(value => {
          try {
            let x = onFulfilled(value)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
        this.rejectedCallbacks.push(reason => {
          try {
            let x = onRejected(reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.status === FULFILLED) {
        setTimeout(() => {
          let x = onFulfilled(this.value)
          resolvePromise(promise, x, resolve, reject)
        })
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          let x = onRejected(this.reason)
          resolvePromise(promise, x, resolve, reject)
        })
      }
      function resolvePromise (promise, x, resolve, reject) {
        if (promise === x) {
          reject(new TypeError('循环引用！'))
        }
        try {
          if (x instanceof PromiseA || (x instanceof Object && typeof x.then === 'function')) {
            x.then(value => {
              resolve(value)
            }, reason => {
              reject(reason)
            })
          } else {
            resolve(x)
          }
        } catch (error) {
          reject(error)
        }
      }
    })

    return promise
    // promise处理程序，表现为[[resolve]](promise, x)的抽象操作，如果x是thenable对象，则尝试生成一个promise处理x，否则，直接resolve x
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  finally(cb) {
    return this.then(
      value => PromiseA.resolve(cb()).then(() => value),
      reason = PromiseA.resolve(cb()).then(() => {throw reason})
    )
  }
  
} 

PromiseA.resolve = function (value) {
  return new PromiseA((resolve, reject) => {
    if (value instanceof PromiseA) {
      value.then(resolve, reject)
    } else {
      resolve(value)
    }
  })
}

PromiseA.reject = function(reason) {
  return new PromiseA((resolve, reject) => {
    reject(reason)
  })
}

PromiseA.all = function(promises) {
  if (!promises.hasOwnProperty(Symbol.iterator)) {
    PromiseA.reject(new TypeError('object is not iterable (cannot read property Symbol(Symbol.iterator))'))
  }
  return new PromiseA((resolve, reject) => {
    const values = []
    promises.forEach(p => {
      p.then(value => {
        values.push(value)
        if (values.length === promises.length) {
          resolve(values)
        }
      }, reason => {
        reject(reason)
      })
    })
  })
}

PromiseA.race = function(promises) {
  return new PromiseA((resolve, reject) => {
    promises.forEach(p => {
      p.then(value => resolve(value),
      reason => reject(reason))
    })
  })
}