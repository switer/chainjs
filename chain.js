
'use strict'

var utils = require('./lib/utils.js')
/*******************************
          Chain
*******************************/
function Bootstrap () {
    var chain = new Chain()
    if (arguments.length) {
        pushHandlers(chain, arguments)
    }
    return chain
}
/**
 *  Turn a regular node function into chain function
 */
Bootstrap.thunk = function (fn) {
    return function (chain) {
        var args = utils.slice(arguments)
        args.shift()
        args.push(chain.next)
        fn.apply(null, args)
    }
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

Chain.prototype = {
    /**
     *  Define a chain node
     **/
    then: function() {
        if (this.state._destroy) return
        pushHandlers(this, arguments)
        return this
    },
    some: function() {
        if (this.state._destroy) return
        var node = pushHandlers(this, arguments)
        if (node.items.length) node.type = 'some'
        return this
    },
    each: function () {
        if (this.state._destroy) return
        var that = this
        var args = utils.slice(arguments)
        args = utils.type(args[0]) == 'array' ? args[0]:args
        utils.each(args, function (item) {
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
        // Deal with current step
        if (this.__id) {
            node = this.props._nodes.get(this.__id)
            if (node.state._isDone) return
            else if (this.__branchGoto) {
                // skip another if-else
            }
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
            node.state._isDone = true
        }
        // Get next node
        if (this.__branchGoto) {
            node = this.props._nodes.getByProp('name', this.__branchGoto)
            if (!node) throw new Error('Branch is not exist !')
            if (this.__id && !this.props._nodes.isNextTo(node.id, this.__id)) {
                throw new Error('Can not goto previous step !')
            }
        } else {
            if (this.props._nodes.isLast(this.__id)) return this.end.apply(this, arguments)
            if (!this.__id) {
                node = this.props._nodes.first()
            } else {
                // here the node never the last only
                node = this.props._nodes.next(this.__id)
            }
            // Get next step and skip branch step recursively
            while (node && node.type == 'branch') {
                node = this.props._nodes.next(node.id)
            }
            // all step is over call final step
            if (!node) return this.end.apply(this, arguments)
        }
        // node handler is not set
        if (!node.items.length) return
        // Mutiple handlers in a node
        if (node.items.length > 1) {
            node.state._multiple = true
            node.state._pending = true
            node.state._dones = []
        }
        var that = this
        if (node.items) {
            var proto = that.constructor.prototype
            for (var index = 0; index < node.items.length; index++) {
                var item = node.items[index]
                var xArgs = args
                var ChainDummy = utils.create(function () {
                    this.__id = node.id
                    this.__index = index
                    this.__callee = item
                    this.__arguments = xArgs
                    this.state = that.state
                    this.props = that.props
                }, proto)
                var chainDummy = new ChainDummy()
                chainDummy.next = utils.bind(proto.next, chainDummy)

                xArgs.unshift(chainDummy)
                item.apply(that.props._context, xArgs)
            }
        }
        return this
    },
    nextTo: function (branch) {
        if (this.state._destroy) return

        utils.want(branch, 'string')
        this.__branchGoto = branch
        var args = utils.slice(arguments)
        args.shift()
        this.next.apply(this, args)
    },
    branch: function (branch, func) {
        if (this.state._destroy) return

        utils.want(branch, 'string')
        utils.missing(func, 'handler')
        var node = pushNode.call(this, func)
        node.type = 'branch'
        node.name = branch
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
     *  Just a shortcut for setTimeout(chain.next, time)
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
    /**
     *  Start running current chain
     */
    start: function() {
        if (this.state._end || this.state._destroy) return

        this.next.apply(this, arguments)
        return this
    },
    /**
     *  @RuntimeMethod
     *  Ending current chain and call final step
     */
    end: function() {
        if (this.state._end || this.state._destroy) return
        this.state._end = true
        utils.batch.apply(utils, [this.props._context, this.props._finals, this].concat(utils.slice(arguments)) )
        return this
    },
    /**
     *  All step is over or call chain.end() will be call final step handlers
     */
    final: function (handler) {
        if (this.state._destroy) return
        this.props._finals.push(handler)
        return this
    },
    /**
     *  @RuntimeMethod
     *  Destroy current chain, but it don't call final step
     **/
    destroy: function() {
        this.state._destroy = true
        this.props._context = null
        this.props._data = null
        this.props._nodes = null
        this.props._finals = null
        setAlltoNoop(this, ['then', 'some', 'next', 'nextTo', 'branch', 'retry', 'wait', 'data', 'start', 'end', 'final', 'destroy'])
        return this
    },
    /**
     *  Binding each step handler with specified context
     */
    context: function(ctx) {
        if (this.state._destroy) return
        this.props._context = ctx
        return this
    }
}
Chain.prototype.constructor = Chain

/**
 *  Push a step node to LinkNodes
 */
function pushNode( /*handler1, handler2, ..., handlerN*/ ) {
    var node = {
        items: utils.slice(arguments),
        state: {}
    }
    var id = this.props._nodes.add(node)
    node.id = id
    return node
}
/**
 *  Push functions to step node
 */
function pushHandlers (chain, args) {
    return pushNode.apply(chain, utils.type(args[0]) == 'array' ? args[0]:args)
}

function noop () {}
/**
 *  Call by destroy step
 */
function setAlltoNoop (obj, methods) {
    utils.each(methods, function (method) {
        obj[method] = noop
    })
}

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
LinkNodes.prototype = {
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
    },
    getByProp: function (prop, value) {
        var dest
        var that = this
        utils.some(this._link, function (id) {
            var node = that.get(id)
            if (node[prop] === value) {
                dest = node
                return true
            } 
        })
        return dest
    },
    isNextTo: function (nextId, preId) {
        return this._link.indexOf(nextId) > this._link.indexOf(preId)
    }
}

module.exports = Bootstrap