'use strict'

/**
 *  Util functions
 **/
module.exports = {
    /**
     * forEach
     * I don't want to import underscore, it looks like so heavy if using in chain
     */
    each: function(obj, iterator, context) {
        if (!obj) return
        else if (obj.forEach) obj.forEach(iterator)
        else if (obj.length == +obj.length) {
            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i)
        } else {
            for (var key in obj) iterator.call(context, obj[key], key)
        }
    },
    some: function (arr, iterator) {
        if (!arr) return
        else if (arr.some) arr.forEach(iterator)
        else {
            for (var i = 0; i < arr.length; i++) {
                if (iterator.call(null, arr[i], i)) break
            }
        }
    },
    /**
     *  Invoke handlers in batch process
     */
    batch: function(context, handlers/*, params*/ ) {
        var args = this.slice(arguments)
        args.shift()
        args.shift()
        this.each(handlers, function(handler) {
            if (handler) handler.apply(context, args)
        })
    },
    /**
     *  binding this context
     */
    bind: function(fn, ctx) {
        // native bind is easey to cause maxium call stack 
        // if (fn.bind) return fn.bind(ctx)
        return function () {
            fn.apply(ctx, arguments)
        }
    },
    /**
     *  Array.slice
     */
    slice: function(array) {
        // return Array.prototype.slice.call(array)
        var i = array.length
        var a = new Array(i)
        while(i) {
            i --
            a[i] = array[i]
        }
        return a
    },
    /**
     *  Merge for extObj to obj
     **/
    merge: function(obj, extObj) {
        this.each(extObj, function(value, key) {
            if (extObj.hasOwnProperty(key)) obj[key] = value
        })
        return obj
    },
    type: function (obj) {
        return /\[object ([a-zA-Z]+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()
    },
    missing: function (param, paramName) {
        if (!param) throw new Error('Missing param: ' + paramName)
    },
    want: function (obj, type) {
        if (this.type(obj) != type) throw new Error('Want param ' + obj + ' type is a/an ' + type)
    },
    /**
     * Create a class with specified proto
     */
    create: function (f, proto) {
        function Ctor() {}
        Ctor.prototype = proto
        f.prototype = new Ctor()
        f.prototype.constructor = Ctor
        return f
    },
    indexOf: function (arr, tar) {
        if (arr.indexOf) return arr.indexOf(tar)
        else {
            var i = -1
            this.some(arr, function (item, index) {
                if (item === tar) {
                    i = index
                    return true
                }
            })
            return i
        }
    }
}