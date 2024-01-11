const wrap = require('./wrap')

let options
let propertyDefined = false

module.exports = (newOptions = {}) => {
  options = newOptions
  if (propertyDefined) {
    return
  }
  propertyDefined = true
  
  const Layer = require('express/lib/router/layer')
  Object.defineProperty(Layer.prototype, "handle", {
    enumerable: true,
    get: function() { return this.__handle; },
    set: function(fn) { 
      if (fn.length < 4)
        fn = wrap(fn, options)
      this.__handle = fn
    }
  })
}
