!function () {

/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */

'use strict;'

/**
 *  Util functions
 **/
var utils = {
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
     *  Array.slice
     */
    slice: function(array) {
        return Array.prototype.slice.call(array)
    },
    /**
     *  Function.bind
     */
    bind: function(func, context) {
        if (func.bind) return func.bind(context)
        var args = this.slice(arguments)
        args.splice(0, 2)
        return function() {
            func.apply(context, args.concat(arguments))
        }
    },
    /**
     *  Merge Two Object to destObj
     **/
    merge: function(obj, extObj) {
        this.each(extObj, function(value, key) {
            if (extObj.hasOwnProperty(key)) obj[key] = value
        })
        return obj
    },
    /**
     *  Function call simple encapsulation, use try-catch
     */
    invoke: function(handler, context) {
        var args = this.slice(arguments)
        args = args.pop()
        try {
            handler.apply(context, args)
        } catch (e) {}
    }
}
/*******************************
          Chain
*******************************/
function Bootstrap () {
    var chain = new Chain()
    pushNode.apply(chain, arguments)
    return chain
}
/**
 *  Chainjs Constructor
 */
function Chain() {
    this._context = this
    this._data = {}
    this._nodes = new LinkNodes()
    this._finals =[]
}
function pushNode( /*handler1, handler2, ..., handlerN*/ ) {
    var node = {
        items: utils.slice(arguments)
    }
    var id = this._nodes.add(node)
    node.id = id
    return node
}

utils.merge(Chain.prototype, {
    /**
     *  Define a chain node
     **/
    then: function() {
        pushNode.apply(this, arguments)
        return this
    },
    some: function() {
        var node = pushNode.apply(this, arguments)
        if (node.items.length) node.type = 'some'
        return this
    },
    /**
     *  @RuntimeMethod can be call in runtime
     *  Check current node states and execulate nextNode
     **/
    next: function() {
        var that = this
        var args = utils.slice(arguments)
        var node
        if (this._end) return

        if (this.__id) {
            node = this._nodes.get(this.__id)
            if (node._isDone) return
            else if (node._multiple && node.type == 'some') {
                if (!node._pending) return
                if (~node._dones.indexOf(this.__index)) node._dones.push(this.__index)
                if (node._dones.length >= 1) return
                node._pending = true
            } 
            else if (node._multiple) {
                if (!node._pending) return
                if (!~node._dones.indexOf(this.__index)) node._dones.push(this.__index)
                if (node._dones.length != node.items.length) return
                node._pending = true
            }
            node._isDone = true
            if (this._nodes.isLast(this.__id)) return this.end()
        }

        // GET next node
        node = this.__id ? this._nodes.next(this.__id):this._nodes.first()
        // node handler is not set
        if (!node.items.length) return
        // Mutiple handlers in a node
        if (node.items.length > 1) {
            node._multiple = true
            node._pending = true
            node._dones = []
        }
        utils.each(node.items, function(item, index) {
            var xArgs = args.slice()
            var chainDummy = {}
            utils.merge(chainDummy, that)
            chainDummy.__id = node.id
            chainDummy.__index = index
            chainDummy.__proto__ = that.__proto__

            xArgs.unshift(chainDummy)
            item.apply(that._context, xArgs)
        })
        return this
    },
    /**
     *  @RuntimeMethod can be call in runtime
     *  comment
     **/
    wait: function(time) {
        var that = this
        var args = utils.slice(arguments)
        args.shift()
        setTimeout(function() {
            that.next.apply(that, args)
        }, time)
    },
    /**
     *  @RuntimeMethod can be call in runtime
     *
     *  Save/Update/Get data in current chain instance
     */
    data: function(key, data) {
        // set data
        if (key && data) {
            this._data[key] = data
            return this
        }
        // get data value by key
        else if (key && !data) return this._data[key]
            // return all data of currently chain
        else return util.merge({}, this._data)
    },
    start: function() {
        if (this._end) return

        this._running = true
        this.next()  
        return this
    },
    end: function() {
        if (this._end) return
        this._end = true
        utils.batch(this._context, this._finals, this)
        return this
    },
    final: function (handler) {
        this._finals.push(handler)
        return this
    },
    /**
     *  @RuntimeMethod can be call in runtime
     **/
    destroy: function() {
        this._context = null
        this._data = null
        this._nodes = null
        return this
    },
    context: function(ctx) {
        this._context = ctx
        return this
    }
})

/**
 *  Link nodes data structure
 **/
function LinkNodes() {
    var id = 1
    this._link = []
    this._map = {}
    this._allot = function() {
        return id++
    }
}
utils.merge(LinkNodes.prototype, {
    add: function(node) {
        var id = this._allot()
        this._map[id] = node
        this._link.push(id)
        return id
    },
    isLast: function (id) {
        return this._link.indexOf(id) === this._link.length - 1
    },
    exist: function(id) {
        return !!(~this._link.indexOf(id))
    },
    first: function() {
        return this._map[this._link[0]]
    },
    get: function(id) {
        return this._map[id]
    },
    size: function () {
        return this._link.length
    },
    next: function(id) {
        var cursor = this._link.indexOf(id) + 1
        return this._map[this._link[cursor]]
    },
    remove: function(id) {
        var index = this._link.indexOf(id)
        if (~index) this._link.splice(index, 1)
        return this
    }
})



// AMD/CMD/node/bang
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Bootstrap

    exports.Chain = Bootstrap
} else this.Chain = Bootstrap


}();