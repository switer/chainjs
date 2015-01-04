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
    }
}
/*******************************
          Chain
*******************************/
function Bootstrap () {
    var chain = new Chain()
    if (arguments.length) {
        pushSteps(chain, arguments)
    }
    return chain
}
/**
 *  Chainjs Constructor
 */
function Chain() {
    this.props = {}
    this.state = {}

    this.props._context = this
    this.props._data = {}
    this.props._nodes = new LinkNodes()
    this.props._finals =[]
}
function pushNode( /*handler1, handler2, ..., handlerN*/ ) {
    var node = {
        items: utils.slice(arguments),
        state: {}
    }
    var id = this.props._nodes.add(node)
    node.id = id
    return node
}
function pushSteps (chain, args) {
    return pushNode.apply(chain, utils.type(args[0]) == 'array' ? args[0]:args)
}

function noop () {}
function setAlltoNoop (obj, methods) {
    utils.each(methods, function (method) {
        obj[method] = noop
    })
}

utils.merge(Chain.prototype, {
    /**
     *  Define a chain node
     **/
    then: function() {
        if (this.state._destroy) return
        pushSteps(this, arguments)
        return this
    },
    some: function() {
        if (this.state._destroy) return
        var node = pushSteps(this, arguments)
        if (node.items.length) node.type = 'some'
        return this
    },
    each: function () {
        if (this.state._destroy) return
        var that = this
        var args = utils.slice(arguments)
        args = utils.type(args[0]) == 'array' ? args[0]:args
        args.forEach(function (item) {
            pushNode.call(that, item)
        })
        return this
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Check current node states and execulate nextNode
     **/
    next: function() {
        if (this.state._end || this.state._destroy) return
        var args = utils.slice(arguments)
        var node

        if (this.__id) {
            node = this.props._nodes.get(this.__id)
            if (node._isDone) return
            else if (node.state._multiple && node.type == 'some') {
                if (!node.state._pending) return
                if (~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)
                if (node.state._dones.length >= 1) return
                node.state._pending = true
            } 
            else if (node.state._multiple) {
                if (!node.state._pending) return
                if (!~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)
                if (node.state._dones.length != node.items.length) return
                node.state._pending = true
            }
            node._isDone = true
            if (this.props._nodes.isLast(this.__id)) return this.end.apply(this, arguments)
        }

        // Get next node
        node = this.__id ? this.props._nodes.next(this.__id):this.props._nodes.first()
        // node handler is not set
        if (!node.items.length) return
        // Mutiple handlers in a node
        if (node.items.length > 1) {
            node.state._multiple = true
            node.state._pending = true
            node.state._dones = []
        }
        utils.each(node.items, function(item, index) {
            var xArgs = args.slice()
            var chainDummy = {
                state: this.state,
                props: this.props
            }
            chainDummy.__id = node.id
            chainDummy.__index = index
            chainDummy.__callee = item
            chainDummy.__arguments = xArgs
            chainDummy.__proto__ = this.__proto__

            xArgs.unshift(chainDummy)
            item.apply(this.props._context, xArgs)
        }.bind(this))
        return this
    },

    /**
     *  @RuntimeMethod only be called in runtime
     *  Run current step once again
     **/
    retry: function () {
        if (this.state._end || this.state._destroy) return
        this.__callee.apply(this.props._context, this.__arguments)
    },
    /**
     *  @RuntimeMethod only be called in runtime
     **/
    wait: function(time) {
        if (this.state._destroy) return
        var that = this
        var args = utils.slice(arguments)
        args.shift()
        setTimeout(function() {
            that.next.apply(that, args)
        }, time)
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Save, Update, Get data in current chain instance
     */
    data: function(key, data) {
        if (this.state._destroy) return
        var args = utils.slice(arguments)
        var len = args.length
        // set data
        if (len >= 2 ) {
            this.props._data[key] = data
            return this
        }
        // get data value by key
        else if (len === 1 && utils.type(key) == 'object') {
            for (var k in key) {
                 this.props._data[k] = key[k]
            }
        }
        else if (len === 1) return this.props._data[key]
            // return all data of currently chain
        else return utils.merge({}, this.props._data)
    },
    start: function() {
        if (this.state._end || this.state._destroy) return

        this.state._running = true
        this.next.apply(this, arguments)
        return this
    },
    end: function() {
        if (this.state._end || this.state._destroy) return
        this.state._end = true
        utils.batch.apply(utils, [this.props._context, this.props._finals, this].concat(utils.slice(arguments)) )
        return this
    },
    final: function (handler) {
        if (this.state._destroy) return
        this.props._finals.push(handler)
        return this
    },
    /**
     *  @RuntimeMethod can be call in runtime
     **/
    destroy: function() {
        this.state._destroy = true
        this.props._context = null
        this.props._data = null
        this.props._nodes = null
        this.props._finals = null
        setAlltoNoop(this, ['then', 'some', 'next', 'wait', 'data', 'start', 'end', 'final', 'destroy'])
        return this
    },
    context: function(ctx) {
        if (this.state._destroy) return
        this.props._context = ctx
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
    first: function() {
        return this._map[this._link[0]]
    },
    get: function(id) {
        return this._map[id]
    },
    next: function(id) {
        var cursor = this._link.indexOf(id) + 1
        return this._map[this._link[cursor]]
    }
    /*,
    exist: function(id) {
        return !!(~this._link.indexOf(id))
    },
    size: function () {
        return this._link.length
    },
    remove: function(id) {
        var index = this._link.indexOf(id)
        if (~index) this._link.splice(index, 1)
        return this
    }
    */
})


// AMD/CMD/node/bang
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Bootstrap

    exports.Chain = Bootstrap
} else this.Chain = Bootstrap
