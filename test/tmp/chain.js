
// instrument by jscoverage, do not modifly this file
(function (file, lines, conds, source) {
  var BASE;
  if (typeof global === 'object') {
    BASE = global;
  } else if (typeof window === 'object') {
    BASE = window;
  } else {
    throw new Error('[jscoverage] unknow ENV!');
  }
  if (BASE._$jscoverage) {
    BASE._$jscmd(file, 'init', lines, conds, source);
    return;
  }
  var cov = {};
  /**
   * jsc(file, 'init', lines, condtions)
   * jsc(file, 'line', lineNum)
   * jsc(file, 'cond', lineNum, expr, start, offset)
   */
  function jscmd(file, type, line, express, start, offset) {
    var storage;
    switch (type) {
      case 'init':
        if(cov[file]){
          storage = cov[file];
        } else {
          storage = [];
          for (var i = 0; i < line.length; i ++) {
            storage[line[i]] = 0;
          }
          var condition = express;
          var source = start;
          storage.condition = condition;
          storage.source = source;
        }
        cov[file] = storage;
        break;
      case 'line':
        storage = cov[file];
        storage[line] ++;
        break;
      case 'cond':
        storage = cov[file];
        storage.condition[line] ++;
        return express;
    }
  }

  BASE._$jscoverage = cov;
  BASE._$jscmd = jscmd;
  jscmd(file, 'init', lines, conds, source);
})('chain.js', [10,25,46,262,296,383,16,20,18,26,27,28,29,30,37,38,40,41,42,43,52,53,57,59,63,64,65,66,69,67,77,78,130,131,148,81,98,90,96,102,105,110,113,117,126,127,128,132,133,142,143,145,146,153,154,155,156,157,162,163,164,165,166,167,175,183,184,185,186,187,196,197,200,201,206,219,220,228,229,230,237,238,245,246,247,248,249,250,251,258,259,268,272,273,274,280,288,289,323,324,325,326,335,336,344,345,350,347,348,356,359,362,376,377,378,379,380,385,386,387,388,391,394,397,400,401,404,405,406,413,407,409,410,416,425], {"17_8_16":0,"51_12_19":0,"56_12_19":0,"58_12_17":0,"62_12_19":0,"65_48_7":0,"65_56_4":0,"76_12_38":0,"76_12_15":0,"76_31_19":0,"80_12_9":0,"82_16_18":0,"83_21_17":0,"86_21_43":0,"86_21_20":0,"86_45_19":0,"87_20_20":0,"88_20_40":0,"89_20_29":0,"92_21_20":0,"93_20_20":0,"94_20_41":0,"95_20_45":0,"101_12_17":0,"103_16_5":0,"104_16_60":0,"104_16_9":0,"104_29_47":0,"108_16_35":0,"109_16_10":0,"116_19_4":0,"116_27_21":0,"120_16_5":0,"123_12_18":0,"125_12_21":0,"151_12_19":0,"160_12_19":0,"174_12_38":0,"174_12_15":0,"174_31_19":0,"182_12_19":0,"195_12_19":0,"199_12_8":0,"204_17_40":0,"204_17_9":0,"204_30_27":0,"209_17_9":0,"217_12_38":0,"217_12_15":0,"217_31_19":0,"227_12_38":0,"227_12_15":0,"227_31_19":0,"236_12_19":0,"257_12_19":0,"280_66_7":0,"280_74_4":0,"302_12_4":0,"303_17_11":0,"304_17_25":0,"311_12_4":0,"312_17_8":0,"315_20_30":0,"327_16_7":0,"334_12_7":0,"357_16_26":0,"365_12_6":0,"368_12_22":0,"408_16_20":0,"422_4_30":0,"423_8_47":0,"423_8_29":0,"423_41_14":0}, ["/*"," *  chainjs"," *  http://github.com/switer/chainjs"," *"," *  Copyright (c) 2013 \"switer\" guankaishe"," *  Licensed under the MIT license."," *  https://github.com/switer/chainjs/blob/master/LICENSE"," */","","'use strict';","","/*******************************","          Chain","*******************************/","function Bootstrap () {","    var chain = new Chain()","    if (arguments.length) {","        pushHandlers(chain, arguments)","    }","    return chain","}","/**"," *  Turn a regular node function into chain function"," */","Bootstrap.thunk = function (fn) {","    return function (chain) {","        var args = utils.slice(arguments)","        args.shift()","        args.push(chain.next)","        fn.apply(null, args)","    }","}","/**"," *  Chainjs Constructor"," */","function Chain() {","    this.props = {}","    this.state = {}","","    this.props._context = this","    this.props._data = {}","    this.props._nodes = new LinkNodes()","    this.props._finals =[]","}","","Chain.prototype = {","    /**","     *  Define a chain node","     **/","    then: function() {","        if (this.state._destroy) return","        pushHandlers(this, arguments)","        return this","    },","    some: function() {","        if (this.state._destroy) return","        var node = pushHandlers(this, arguments)","        if (node.items.length) node.type = 'some'","        return this","    },","    each: function () {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args = utils.type(args[0]) == 'array' ? args[0]:args","        utils.each(args, function (item) {","            pushNode.call(that, item)","        })","        return this","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Check current node states and execulate nextNode","     **/","    next: function() {","        if (this.state._end || this.state._destroy) return","        var args = utils.slice(arguments)","        var node","        // Deal with current step","        if (this.__id) {","            node = this.props._nodes.get(this.__id)","            if (node.state._isDone) return","            else if (this.__branchGoto) {","                // skip another if-else","            }","            else if (node.state._multiple && node.type == 'some') {","                if (!node.state._pending) return","                if (~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length >= 1) return","                node.state._pending = true","            } ","            else if (node.state._multiple) {","                if (!node.state._pending) return","                if (!~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length != node.items.length) return","                node.state._pending = true","            }","            node.state._isDone = true","        }","        // Get next node","        if (this.__branchGoto) {","            node = this.props._nodes.getByProp('name', this.__branchGoto)","            if (!node) throw new Error('Branch is not exist !')","            if (this.__id && !this.props._nodes.isNextTo(node.id, this.__id)) {","                throw new Error('Can not goto previous step !')","            }","        } else {","            if (this.props._nodes.isLast(this.__id)) return this.end.apply(this, arguments)","            if (!this.__id) {","                node = this.props._nodes.first()","            } else {","                // here the node never the last only","                node = this.props._nodes.next(this.__id)","            }","            // Get next step and skip branch step recursively","            while (node && node.type == 'branch') {","                node = this.props._nodes.next(node.id)","            }","            // all step is over call final step","            if (!node) return this.end.apply(this, arguments)","        }","        // node handler is not set","        if (!node.items.length) return","        // Mutiple handlers in a node","        if (node.items.length > 1) {","            node.state._multiple = true","            node.state._pending = true","            node.state._dones = []","        }","        var that = this","        utils.each(node.items, function(item, index) {","            var xArgs = args","            var chainDummy = {","                __id: node.id,","                __index: index,","                __callee: item,","                __arguments: xArgs,","","                state: that.state,","                props: that.props","            }","            chainDummy.__proto__ = that.__proto__","            chainDummy.next = utils.bind(chainDummy.__proto__.next, chainDummy)","","            xArgs.unshift(chainDummy)","            item.apply(that.props._context, xArgs)","        })","        return this","    },","    nextTo: function (branch) {","        if (this.state._destroy) return","","        utils.want(branch, 'string')","        this.__branchGoto = branch","        var args = utils.slice(arguments)","        args.shift()","        this.next.apply(this, args)","    },","    branch: function (branch, func) {","        if (this.state._destroy) return","","        utils.want(branch, 'string')","        utils.missing(func, 'handler')","        var node = pushNode.call(this, func)","        node.type = 'branch'","        node.name = branch","        return this","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Run current step once again","     **/","    retry: function () {","        if (this.state._end || this.state._destroy) return","        this.__callee.apply(this.props._context, this.__arguments)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Just a shortcut for setTimeout(chain.next, time)","     **/","    wait: function(time) {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args.shift()","        setTimeout(function() {","            that.next.apply(that, args)","        }, time)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Save, Update, Get data in current chain instance","     */","    data: function(key, data) {","        if (this.state._destroy) return","        var args = utils.slice(arguments)","        var len = args.length","        // set data","        if (len >= 2 ) {","            this.props._data[key] = data","            return this","        }","        // get data value by key","        else if (len === 1 && utils.type(key) == 'object') {","            for (var k in key) {","                 this.props._data[k] = key[k]","            }","        }","        else if (len === 1) return this.props._data[key]","        // return all data of currently chain","        else return utils.merge({}, this.props._data)","    },","    /**","     *  Start running current chain","     */","    start: function() {","        if (this.state._end || this.state._destroy) return","","        this.next.apply(this, arguments)","        return this","    },","    /**","     *  @RuntimeMethod","     *  Ending current chain and call final step","     */","    end: function() {","        if (this.state._end || this.state._destroy) return","        this.state._end = true","        utils.batch.apply(utils, [this.props._context, this.props._finals, this].concat(utils.slice(arguments)) )","        return this","    },","    /**","     *  All step is over or call chain.end() will be call final step handlers","     */","    final: function (handler) {","        if (this.state._destroy) return","        this.props._finals.push(handler)","        return this","    },","    /**","     *  @RuntimeMethod","     *  Destroy current chain, but it don't call final step","     **/","    destroy: function() {","        this.state._destroy = true","        this.props._context = null","        this.props._data = null","        this.props._nodes = null","        this.props._finals = null","        setAlltoNoop(this, ['then', 'some', 'next', 'nextTo', 'branch', 'retry', 'wait', 'data', 'start', 'end', 'final', 'destroy'])","        return this","    },","    /**","     *  Binding each step handler with specified context","     */","    context: function(ctx) {","        if (this.state._destroy) return","        this.props._context = ctx","        return this","    }","}","Chain.prototype.constructor = Chain","","/**"," *  Push a step node to LinkNodes"," */","function pushNode( /*handler1, handler2, ..., handlerN*/ ) {","    var node = {","        items: utils.slice(arguments),","        state: {}","    }","    var id = this.props._nodes.add(node)","    node.id = id","    return node","}","/**"," *  Push functions to step node"," */","function pushHandlers (chain, args) {","    return pushNode.apply(chain, utils.type(args[0]) == 'array' ? args[0]:args)","}","","function noop () {}","/**"," *  Call by destroy step"," */","function setAlltoNoop (obj, methods) {","    utils.each(methods, function (method) {","        obj[method] = noop","    })","}","","/**"," *  Util functions"," **/","var utils = {","    /**","     * forEach","     * I don't want to import underscore, it looks like so heavy if using in chain","     */","    each: function(obj, iterator, context) {","        if (!obj) return","        else if (obj.forEach) obj.forEach(iterator)","        else if (obj.length == +obj.length) {","            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i)","        } else {","            for (var key in obj) iterator.call(context, obj[key], key)","        }","    },","    some: function (arr, iterator) {","        if (!arr) return","        else if (arr.some) arr.forEach(iterator)","        else {","            for (var i = 0; i < arr.length; i++) {","                if (iterator.call(null, arr[i], i)) break","            }","        }","    },","    /**","     *  Invoke handlers in batch process","     */","    batch: function(context, handlers/*, params*/ ) {","        var args = this.slice(arguments)","        args.shift()","        args.shift()","        this.each(handlers, function(handler) {","            if (handler) handler.apply(context, args)","        })","    },","    /**","     *  binding this context","     */","    bind: function(fn, ctx) {","        if (fn.bind) return fn.bind(ctx)","        return function () {","            fn.apply(ctx, arguments)","        }","    },","    /**","     *  Array.slice","     */","    slice: function(array) {","        // return Array.prototype.slice.call(array)","        var i = array.length","        var a = new Array(i)","        while(i) {","            i --","            a[i] = array[i]","        }","        return a","    },","    /**","     *  Merge for extObj to obj","     **/","    merge: function(obj, extObj) {","        this.each(extObj, function(value, key) {","            if (extObj.hasOwnProperty(key)) obj[key] = value","        })","        return obj","    },","    type: function (obj) {","        return /\\[object ([a-zA-Z]+)\\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()","    },","    missing: function (param, paramName) {","        if (!param) throw new Error('Missing param: ' + paramName)","    },","    want: function (obj, type) {","        if (this.type(obj) != type) throw new Error('Want param ' + obj + ' type is a/an ' + type)","    }","}","","/**"," *  Link nodes data structure"," **/","function LinkNodes() {","    var id = 1","    this._link = []","    this._map = {}","    this._allot = function() {","        return id++","    }","}","LinkNodes.prototype = {","    add: function(node) {","        var id = this._allot()","        this._map[id] = node","        this._link.push(id)","        return id","    },","    isLast: function (id) {","        return this._link.indexOf(id) === this._link.length - 1","    },","    first: function() {","        return this._map[this._link[0]]","    },","    get: function(id) {","        return this._map[id]","    },","    next: function(id) {","        var cursor = this._link.indexOf(id) + 1","        return this._map[this._link[cursor]]","    },","    getByProp: function (prop, value) {","        var dest","        var that = this","        utils.some(this._link, function (id) {","            var node = that.get(id)","            if (node[prop] === value) {","                dest = node","                return true","            } ","        })","        return dest","    },","    isNextTo: function (nextId, preId) {","        return this._link.indexOf(nextId) > this._link.indexOf(preId)","    }","}","","","// AMD/CMD/node/bang","if (typeof exports !== 'undefined') {","    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Bootstrap","","    exports.Chain = Bootstrap","} else this.Chain = Bootstrap",""]);
/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */
_$jscmd("chain.js", "line", 10);

"use strict";

/*******************************
          Chain
*******************************/
function Bootstrap() {
    _$jscmd("chain.js", "line", 16);
    var chain = new Chain();
    if (_$jscmd("chain.js", "cond", "17_8_16", arguments.length)) {
        _$jscmd("chain.js", "line", 18);
        pushHandlers(chain, arguments);
    }
    _$jscmd("chain.js", "line", 20);
    return chain;
}

_$jscmd("chain.js", "line", 25);

/**
 *  Turn a regular node function into chain function
 */
Bootstrap.thunk = function(fn) {
    _$jscmd("chain.js", "line", 26);
    return function(chain) {
        _$jscmd("chain.js", "line", 27);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 28);
        args.shift();
        _$jscmd("chain.js", "line", 29);
        args.push(chain.next);
        _$jscmd("chain.js", "line", 30);
        fn.apply(null, args);
    };
};

/**
 *  Chainjs Constructor
 */
function Chain() {
    _$jscmd("chain.js", "line", 37);
    this.props = {};
    _$jscmd("chain.js", "line", 38);
    this.state = {};
    _$jscmd("chain.js", "line", 40);
    this.props._context = this;
    _$jscmd("chain.js", "line", 41);
    this.props._data = {};
    _$jscmd("chain.js", "line", 42);
    this.props._nodes = new LinkNodes();
    _$jscmd("chain.js", "line", 43);
    this.props._finals = [];
}

_$jscmd("chain.js", "line", 46);

Chain.prototype = {
    /**
     *  Define a chain node
     **/
    then: function() {
        if (_$jscmd("chain.js", "cond", "51_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 52);
        pushHandlers(this, arguments);
        _$jscmd("chain.js", "line", 53);
        return this;
    },
    some: function() {
        if (_$jscmd("chain.js", "cond", "56_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 57);
        var node = pushHandlers(this, arguments);
        if (_$jscmd("chain.js", "cond", "58_12_17", node.items.length)) node.type = "some";
        _$jscmd("chain.js", "line", 59);
        return this;
    },
    each: function() {
        if (_$jscmd("chain.js", "cond", "62_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 63);
        var that = this;
        _$jscmd("chain.js", "line", 64);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 65);
        args = utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "65_48_7", args[0]) : _$jscmd("chain.js", "cond", "65_56_4", args);
        _$jscmd("chain.js", "line", 66);
        utils.each(args, function(item) {
            _$jscmd("chain.js", "line", 67);
            pushNode.call(that, item);
        });
        _$jscmd("chain.js", "line", 69);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Check current node states and execulate nextNode
     **/
    next: function() {
        if (_$jscmd("chain.js", "cond", "76_12_38", _$jscmd("chain.js", "cond", "76_12_15", this.state._end) || _$jscmd("chain.js", "cond", "76_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 77);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 78);
        var node;
        // Deal with current step
        if (_$jscmd("chain.js", "cond", "80_12_9", this.__id)) {
            _$jscmd("chain.js", "line", 81);
            node = this.props._nodes.get(this.__id);
            if (_$jscmd("chain.js", "cond", "82_16_18", node.state._isDone)) return; else if (_$jscmd("chain.js", "cond", "83_21_17", this.__branchGoto)) {} else if (_$jscmd("chain.js", "cond", "86_21_43", _$jscmd("chain.js", "cond", "86_21_20", node.state._multiple) && _$jscmd("chain.js", "cond", "86_45_19", node.type == "some"))) {
                if (_$jscmd("chain.js", "cond", "87_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "88_20_40", ~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "89_20_29", node.state._dones.length >= 1)) return;
                _$jscmd("chain.js", "line", 90);
                node.state._pending = true;
            } else if (_$jscmd("chain.js", "cond", "92_21_20", node.state._multiple)) {
                if (_$jscmd("chain.js", "cond", "93_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "94_20_41", !~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "95_20_45", node.state._dones.length != node.items.length)) return;
                _$jscmd("chain.js", "line", 96);
                node.state._pending = true;
            }
            _$jscmd("chain.js", "line", 98);
            node.state._isDone = true;
        }
        // Get next node
        if (_$jscmd("chain.js", "cond", "101_12_17", this.__branchGoto)) {
            _$jscmd("chain.js", "line", 102);
            node = this.props._nodes.getByProp("name", this.__branchGoto);
            if (_$jscmd("chain.js", "cond", "103_16_5", !node)) throw new Error("Branch is not exist !");
            if (_$jscmd("chain.js", "cond", "104_16_60", _$jscmd("chain.js", "cond", "104_16_9", this.__id) && _$jscmd("chain.js", "cond", "104_29_47", !this.props._nodes.isNextTo(node.id, this.__id)))) {
                _$jscmd("chain.js", "line", 105);
                throw new Error("Can not goto previous step !");
            }
        } else {
            if (_$jscmd("chain.js", "cond", "108_16_35", this.props._nodes.isLast(this.__id))) return this.end.apply(this, arguments);
            if (_$jscmd("chain.js", "cond", "109_16_10", !this.__id)) {
                _$jscmd("chain.js", "line", 110);
                node = this.props._nodes.first();
            } else {
                _$jscmd("chain.js", "line", 113);
                // here the node never the last only
                node = this.props._nodes.next(this.__id);
            }
            // Get next step and skip branch step recursively
            while (_$jscmd("chain.js", "cond", "116_19_4", node) && _$jscmd("chain.js", "cond", "116_27_21", node.type == "branch")) {
                _$jscmd("chain.js", "line", 117);
                node = this.props._nodes.next(node.id);
            }
            // all step is over call final step
            if (_$jscmd("chain.js", "cond", "120_16_5", !node)) return this.end.apply(this, arguments);
        }
        // node handler is not set
        if (_$jscmd("chain.js", "cond", "123_12_18", !node.items.length)) return;
        // Mutiple handlers in a node
        if (_$jscmd("chain.js", "cond", "125_12_21", node.items.length > 1)) {
            _$jscmd("chain.js", "line", 126);
            node.state._multiple = true;
            _$jscmd("chain.js", "line", 127);
            node.state._pending = true;
            _$jscmd("chain.js", "line", 128);
            node.state._dones = [];
        }
        _$jscmd("chain.js", "line", 130);
        var that = this;
        _$jscmd("chain.js", "line", 131);
        utils.each(node.items, function(item, index) {
            _$jscmd("chain.js", "line", 132);
            var xArgs = args;
            _$jscmd("chain.js", "line", 133);
            var chainDummy = {
                __id: node.id,
                __index: index,
                __callee: item,
                __arguments: xArgs,
                state: that.state,
                props: that.props
            };
            _$jscmd("chain.js", "line", 142);
            chainDummy.__proto__ = that.__proto__;
            _$jscmd("chain.js", "line", 143);
            chainDummy.next = utils.bind(chainDummy.__proto__.next, chainDummy);
            _$jscmd("chain.js", "line", 145);
            xArgs.unshift(chainDummy);
            _$jscmd("chain.js", "line", 146);
            item.apply(that.props._context, xArgs);
        });
        _$jscmd("chain.js", "line", 148);
        return this;
    },
    nextTo: function(branch) {
        if (_$jscmd("chain.js", "cond", "151_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 153);
        utils.want(branch, "string");
        _$jscmd("chain.js", "line", 154);
        this.__branchGoto = branch;
        _$jscmd("chain.js", "line", 155);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 156);
        args.shift();
        _$jscmd("chain.js", "line", 157);
        this.next.apply(this, args);
    },
    branch: function(branch, func) {
        if (_$jscmd("chain.js", "cond", "160_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 162);
        utils.want(branch, "string");
        _$jscmd("chain.js", "line", 163);
        utils.missing(func, "handler");
        _$jscmd("chain.js", "line", 164);
        var node = pushNode.call(this, func);
        _$jscmd("chain.js", "line", 165);
        node.type = "branch";
        _$jscmd("chain.js", "line", 166);
        node.name = branch;
        _$jscmd("chain.js", "line", 167);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Run current step once again
     **/
    retry: function() {
        if (_$jscmd("chain.js", "cond", "174_12_38", _$jscmd("chain.js", "cond", "174_12_15", this.state._end) || _$jscmd("chain.js", "cond", "174_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 175);
        this.__callee.apply(this.props._context, this.__arguments);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Just a shortcut for setTimeout(chain.next, time)
     **/
    wait: function(time) {
        if (_$jscmd("chain.js", "cond", "182_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 183);
        var that = this;
        _$jscmd("chain.js", "line", 184);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 185);
        args.shift();
        _$jscmd("chain.js", "line", 186);
        setTimeout(function() {
            _$jscmd("chain.js", "line", 187);
            that.next.apply(that, args);
        }, time);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Save, Update, Get data in current chain instance
     */
    data: function(key, data) {
        if (_$jscmd("chain.js", "cond", "195_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 196);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 197);
        var len = args.length;
        // set data
        if (_$jscmd("chain.js", "cond", "199_12_8", len >= 2)) {
            _$jscmd("chain.js", "line", 200);
            this.props._data[key] = data;
            _$jscmd("chain.js", "line", 201);
            return this;
        } else if (_$jscmd("chain.js", "cond", "204_17_40", _$jscmd("chain.js", "cond", "204_17_9", len === 1) && _$jscmd("chain.js", "cond", "204_30_27", utils.type(key) == "object"))) {
            for (var k in key) {
                _$jscmd("chain.js", "line", 206);
                this.props._data[k] = key[k];
            }
        } else if (_$jscmd("chain.js", "cond", "209_17_9", len === 1)) return this.props._data[key]; else return utils.merge({}, this.props._data);
    },
    /**
     *  Start running current chain
     */
    start: function() {
        if (_$jscmd("chain.js", "cond", "217_12_38", _$jscmd("chain.js", "cond", "217_12_15", this.state._end) || _$jscmd("chain.js", "cond", "217_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 219);
        this.next.apply(this, arguments);
        _$jscmd("chain.js", "line", 220);
        return this;
    },
    /**
     *  @RuntimeMethod
     *  Ending current chain and call final step
     */
    end: function() {
        if (_$jscmd("chain.js", "cond", "227_12_38", _$jscmd("chain.js", "cond", "227_12_15", this.state._end) || _$jscmd("chain.js", "cond", "227_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 228);
        this.state._end = true;
        _$jscmd("chain.js", "line", 229);
        utils.batch.apply(utils, [ this.props._context, this.props._finals, this ].concat(utils.slice(arguments)));
        _$jscmd("chain.js", "line", 230);
        return this;
    },
    /**
     *  All step is over or call chain.end() will be call final step handlers
     */
    "final": function(handler) {
        if (_$jscmd("chain.js", "cond", "236_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 237);
        this.props._finals.push(handler);
        _$jscmd("chain.js", "line", 238);
        return this;
    },
    /**
     *  @RuntimeMethod
     *  Destroy current chain, but it don't call final step
     **/
    destroy: function() {
        _$jscmd("chain.js", "line", 245);
        this.state._destroy = true;
        _$jscmd("chain.js", "line", 246);
        this.props._context = null;
        _$jscmd("chain.js", "line", 247);
        this.props._data = null;
        _$jscmd("chain.js", "line", 248);
        this.props._nodes = null;
        _$jscmd("chain.js", "line", 249);
        this.props._finals = null;
        _$jscmd("chain.js", "line", 250);
        setAlltoNoop(this, [ "then", "some", "next", "nextTo", "branch", "retry", "wait", "data", "start", "end", "final", "destroy" ]);
        _$jscmd("chain.js", "line", 251);
        return this;
    },
    /**
     *  Binding each step handler with specified context
     */
    context: function(ctx) {
        if (_$jscmd("chain.js", "cond", "257_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 258);
        this.props._context = ctx;
        _$jscmd("chain.js", "line", 259);
        return this;
    }
};

_$jscmd("chain.js", "line", 262);

Chain.prototype.constructor = Chain;

/**
 *  Push a step node to LinkNodes
 */
function pushNode() {
    _$jscmd("chain.js", "line", 268);
    var node = {
        items: utils.slice(arguments),
        state: {}
    };
    _$jscmd("chain.js", "line", 272);
    var id = this.props._nodes.add(node);
    _$jscmd("chain.js", "line", 273);
    node.id = id;
    _$jscmd("chain.js", "line", 274);
    return node;
}

/**
 *  Push functions to step node
 */
function pushHandlers(chain, args) {
    _$jscmd("chain.js", "line", 280);
    return pushNode.apply(chain, utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "280_66_7", args[0]) : _$jscmd("chain.js", "cond", "280_74_4", args));
}

function noop() {}

/**
 *  Call by destroy step
 */
function setAlltoNoop(obj, methods) {
    _$jscmd("chain.js", "line", 288);
    utils.each(methods, function(method) {
        _$jscmd("chain.js", "line", 289);
        obj[method] = noop;
    });
}

_$jscmd("chain.js", "line", 296);

/**
 *  Util functions
 **/
var utils = {
    /**
     * forEach
     * I don't want to import underscore, it looks like so heavy if using in chain
     */
    each: function(obj, iterator, context) {
        if (_$jscmd("chain.js", "cond", "302_12_4", !obj)) return; else if (_$jscmd("chain.js", "cond", "303_17_11", obj.forEach)) obj.forEach(iterator); else if (_$jscmd("chain.js", "cond", "304_17_25", obj.length == +obj.length)) {
            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i);
        } else {
            for (var key in obj) iterator.call(context, obj[key], key);
        }
    },
    some: function(arr, iterator) {
        if (_$jscmd("chain.js", "cond", "311_12_4", !arr)) return; else if (_$jscmd("chain.js", "cond", "312_17_8", arr.some)) arr.forEach(iterator); else {
            for (var i = 0; i < arr.length; i++) {
                if (_$jscmd("chain.js", "cond", "315_20_30", iterator.call(null, arr[i], i))) break;
            }
        }
    },
    /**
     *  Invoke handlers in batch process
     */
    batch: function(context, handlers) {
        _$jscmd("chain.js", "line", 323);
        var args = this.slice(arguments);
        _$jscmd("chain.js", "line", 324);
        args.shift();
        _$jscmd("chain.js", "line", 325);
        args.shift();
        _$jscmd("chain.js", "line", 326);
        this.each(handlers, function(handler) {
            if (_$jscmd("chain.js", "cond", "327_16_7", handler)) handler.apply(context, args);
        });
    },
    /**
     *  binding this context
     */
    bind: function(fn, ctx) {
        if (_$jscmd("chain.js", "cond", "334_12_7", fn.bind)) return fn.bind(ctx);
        _$jscmd("chain.js", "line", 335);
        return function() {
            _$jscmd("chain.js", "line", 336);
            fn.apply(ctx, arguments);
        };
    },
    /**
     *  Array.slice
     */
    slice: function(array) {
        _$jscmd("chain.js", "line", 344);
        // return Array.prototype.slice.call(array)
        var i = array.length;
        _$jscmd("chain.js", "line", 345);
        var a = new Array(i);
        while (i) {
            _$jscmd("chain.js", "line", 347);
            i--;
            _$jscmd("chain.js", "line", 348);
            a[i] = array[i];
        }
        _$jscmd("chain.js", "line", 350);
        return a;
    },
    /**
     *  Merge for extObj to obj
     **/
    merge: function(obj, extObj) {
        _$jscmd("chain.js", "line", 356);
        this.each(extObj, function(value, key) {
            if (_$jscmd("chain.js", "cond", "357_16_26", extObj.hasOwnProperty(key))) obj[key] = value;
        });
        _$jscmd("chain.js", "line", 359);
        return obj;
    },
    type: function(obj) {
        _$jscmd("chain.js", "line", 362);
        return /\[object ([a-zA-Z]+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase();
    },
    missing: function(param, paramName) {
        if (_$jscmd("chain.js", "cond", "365_12_6", !param)) throw new Error("Missing param: " + paramName);
    },
    want: function(obj, type) {
        if (_$jscmd("chain.js", "cond", "368_12_22", this.type(obj) != type)) throw new Error("Want param " + obj + " type is a/an " + type);
    }
};

/**
 *  Link nodes data structure
 **/
function LinkNodes() {
    _$jscmd("chain.js", "line", 376);
    var id = 1;
    _$jscmd("chain.js", "line", 377);
    this._link = [];
    _$jscmd("chain.js", "line", 378);
    this._map = {};
    _$jscmd("chain.js", "line", 379);
    this._allot = function() {
        _$jscmd("chain.js", "line", 380);
        return id++;
    };
}

_$jscmd("chain.js", "line", 383);

LinkNodes.prototype = {
    add: function(node) {
        _$jscmd("chain.js", "line", 385);
        var id = this._allot();
        _$jscmd("chain.js", "line", 386);
        this._map[id] = node;
        _$jscmd("chain.js", "line", 387);
        this._link.push(id);
        _$jscmd("chain.js", "line", 388);
        return id;
    },
    isLast: function(id) {
        _$jscmd("chain.js", "line", 391);
        return this._link.indexOf(id) === this._link.length - 1;
    },
    first: function() {
        _$jscmd("chain.js", "line", 394);
        return this._map[this._link[0]];
    },
    get: function(id) {
        _$jscmd("chain.js", "line", 397);
        return this._map[id];
    },
    next: function(id) {
        _$jscmd("chain.js", "line", 400);
        var cursor = this._link.indexOf(id) + 1;
        _$jscmd("chain.js", "line", 401);
        return this._map[this._link[cursor]];
    },
    getByProp: function(prop, value) {
        _$jscmd("chain.js", "line", 404);
        var dest;
        _$jscmd("chain.js", "line", 405);
        var that = this;
        _$jscmd("chain.js", "line", 406);
        utils.some(this._link, function(id) {
            _$jscmd("chain.js", "line", 407);
            var node = that.get(id);
            if (_$jscmd("chain.js", "cond", "408_16_20", node[prop] === value)) {
                _$jscmd("chain.js", "line", 409);
                dest = node;
                _$jscmd("chain.js", "line", 410);
                return true;
            }
        });
        _$jscmd("chain.js", "line", 413);
        return dest;
    },
    isNextTo: function(nextId, preId) {
        _$jscmd("chain.js", "line", 416);
        return this._link.indexOf(nextId) > this._link.indexOf(preId);
    }
};

// AMD/CMD/node/bang
if (_$jscmd("chain.js", "cond", "422_4_30", typeof exports !== "undefined")) {
    if (_$jscmd("chain.js", "cond", "423_8_47", _$jscmd("chain.js", "cond", "423_8_29", typeof module !== "undefined") && _$jscmd("chain.js", "cond", "423_41_14", module.exports))) exports = module.exports = Bootstrap;
    _$jscmd("chain.js", "line", 425);
    exports.Chain = Bootstrap;
} else this.Chain = Bootstrap;