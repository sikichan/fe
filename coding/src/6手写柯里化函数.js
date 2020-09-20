export function curry(fn) {
  return (...args) => args.length < fn.length 
  ? currying(args)
  : fn(...args)
  
  function currying(arg) {
    return (...args) => {
      const newArgs = [...arg, ...args]
      return newArgs.length < fn.length
      ? currying(newArgs)
      : fn(...newArgs) 
    }
  }
}

export function curry2(fn) {
  return function () {
    let args = arguments
    if (args.length < fn.length) {
      return currying(args)
    } else {
      return fn.apply(this, args)
    }
  }
  function currying(args) {
    return function () {
      let newArgs = [...args, ...arguments]
      if (newArgs.length < fn.length) {
        return currying(newArgs)
      } else {
        return fn.apply(this, newArgs)
      }
    }
  }
}