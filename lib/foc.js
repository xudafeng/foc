/* ================================================================
 * foc by xdf(xudafeng[at]126.com)
 *
 * first created at : Mon Jun 02 2014 20:15:51 GMT+0800 (CST)
 *
 * ================================================================
 * Copyright 2013 xdf
 *
 * Licensed under the MIT License
 * You may not use this file except in compliance with the License.
 *
 * ================================================================ */

'use strict';

module.exports = function(origin) {
  return function(fn) {
    var that = this;
    var args = Array.prototype.slice.call(arguments);
    var constructor = origin.constructor.name;

    /**
     * return wrap for block
     */
    if (constructor === 'Function') {
      return function(fn) {
        args.push(function() {
          fn.apply(null, arguments);
        });
        try {
          origin.apply(that, args);
        } catch (error) {
          fn(error);
        }
      }
    }
    var gen = origin;

    /**
     * return gen wrap
     */
    if (constructor === 'GeneratorFunction') {
      fn = function(error) {
        if (error) throw error;
      };
      var gen = origin.apply(this, args);
    }
    var next = function(error, res) {
      try {
        var ret = error ? gen.throw(error) : gen.next(res);
      } catch (e) {
        return fn.call(that, error);
      }
      var p = ret.value;

      if (ret.done) return fn.call(that, null, p);
      ret.value = p.constructor.name === 'GeneratorFunctionPrototype' ? foc(p) : p;
      ret.value.call(that, next);
    }
    next();
  }
}
