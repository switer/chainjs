
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
})('chain.js', [10,15,81,121,294,33,34,35,36,45,46,53,59,62,65,72,76,74,82,83,84,85,86,93,94,96,97,98,99,102,106,107,108,111,116,117,127,128,132,134,138,139,140,141,144,142,152,153,175,184,185,201,156,170,162,168,180,181,182,186,187,191,192,193,194,195,196,198,199,209,216,217,218,219,220,229,230,233,234,239,249,250,251,255,256,257,261,262,268,269,270,271,272,273,274,278,279,287,288,289,290,291,296,297,298,299,302,305,308,311,312,334], {"21_12_4":0,"22_17_11":0,"23_17_25":0,"37_16_7":0,"44_12_7":0,"60_16_26":0,"73_8_16":0,"111_66_7":0,"111_74_4":0,"126_12_19":0,"131_12_19":0,"133_12_17":0,"137_12_19":0,"140_48_7":0,"140_56_4":0,"151_12_38":0,"151_12_15":0,"151_31_19":0,"155_12_9":0,"157_16_12":0,"158_21_43":0,"158_21_20":0,"158_45_19":0,"159_20_20":0,"160_20_40":0,"161_20_29":0,"164_21_20":0,"165_20_20":0,"166_20_41":0,"167_20_45":0,"171_16_35":0,"175_27_33":0,"175_61_25":0,"177_12_18":0,"179_12_21":0,"208_12_38":0,"208_12_15":0,"208_31_19":0,"215_12_19":0,"228_12_19":0,"232_12_8":0,"237_17_40":0,"237_17_9":0,"237_30_27":0,"242_17_9":0,"247_12_38":0,"247_12_15":0,"247_31_19":0,"254_12_38":0,"254_12_15":0,"254_31_19":0,"260_12_19":0,"277_12_19":0,"331_4_30":0,"332_8_47":0,"332_8_29":0,"332_41_14":0}, ["/*"," *  chainjs"," *  http://github.com/switer/chainjs"," *"," *  Copyright (c) 2013 \"switer\" guankaishe"," *  Licensed under the MIT license."," *  https://github.com/switer/chainjs/blob/master/LICENSE"," */","","'use strict;'","","/**"," *  Util functions"," **/","var utils = {","    /**","     * forEach","     * I don't want to import underscore, it looks like so heavy if using in chain","     */","    each: function(obj, iterator, context) {","        if (!obj) return","        else if (obj.forEach) obj.forEach(iterator)","        else if (obj.length == +obj.length) {","            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i)","        } else {","            for (var key in obj) iterator.call(context, obj[key], key)","        }","    },","    /**","     *  Invoke handlers in batch process","     */","    batch: function(context, handlers/*, params*/ ) {","        var args = this.slice(arguments)","        args.shift()","        args.shift()","        this.each(handlers, function(handler) {","            if (handler) handler.apply(context, args)","        })","    },","    /**","     *  binding this context","     */","    bind: function(fn, ctx) {","        if (fn.bind) return fn.bind(ctx)","        return function () {","            fn.apply(ctx, arguments)","        }","    },","    /**","     *  Array.slice","     */","    slice: function(array) {","        return Array.prototype.slice.call(array)","    },","    /**","     *  Merge for extObj to obj","     **/","    merge: function(obj, extObj) {","        this.each(extObj, function(value, key) {","            if (extObj.hasOwnProperty(key)) obj[key] = value","        })","        return obj","    },","    type: function (obj) {","        return /\\[object ([a-zA-Z]+)\\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()","    }","}","/*******************************","          Chain","*******************************/","function Bootstrap () {","    var chain = new Chain()","    if (arguments.length) {","        pushSteps(chain, arguments)","    }","    return chain","}","/**"," *  Turn a regular node function into chain function"," */","Bootstrap.thunk = function (fn) {","    return function (chain) {","        var args = utils.slice(arguments)","        args.shift()","        args.push(chain.next)","        fn.apply(null, args)","    }","}","/**"," *  Chainjs Constructor"," */","function Chain() {","    this.props = {}","    this.state = {}","","    this.props._context = this","    this.props._data = {}","    this.props._nodes = new LinkNodes()","    this.props._finals =[]","}","function pushNode( /*handler1, handler2, ..., handlerN*/ ) {","    var node = {","        items: utils.slice(arguments),","        state: {}","    }","    var id = this.props._nodes.add(node)","    node.id = id","    return node","}","function pushSteps (chain, args) {","    return pushNode.apply(chain, utils.type(args[0]) == 'array' ? args[0]:args)","}","","function noop () {}","function setAlltoNoop (obj, methods) {","    utils.each(methods, function (method) {","        obj[method] = noop","    })","}","","utils.merge(Chain.prototype, {","    /**","     *  Define a chain node","     **/","    then: function() {","        if (this.state._destroy) return","        pushSteps(this, arguments)","        return this","    },","    some: function() {","        if (this.state._destroy) return","        var node = pushSteps(this, arguments)","        if (node.items.length) node.type = 'some'","        return this","    },","    each: function () {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args = utils.type(args[0]) == 'array' ? args[0]:args","        utils.each(args, function (item) {","            pushNode.call(that, item)","        })","        return this","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Check current node states and execulate nextNode","     **/","    next: function() {","        if (this.state._end || this.state._destroy) return","        var args = utils.slice(arguments)","        var node","","        if (this.__id) {","            node = this.props._nodes.get(this.__id)","            if (node._isDone) return","            else if (node.state._multiple && node.type == 'some') {","                if (!node.state._pending) return","                if (~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length >= 1) return","                node.state._pending = true","            } ","            else if (node.state._multiple) {","                if (!node.state._pending) return","                if (!~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length != node.items.length) return","                node.state._pending = true","            }","            node._isDone = true","            if (this.props._nodes.isLast(this.__id)) return this.end.apply(this, arguments)","        }","","        // Get next node","        node = this.__id ? this.props._nodes.next(this.__id):this.props._nodes.first()","        // node handler is not set","        if (!node.items.length) return","        // Mutiple handlers in a node","        if (node.items.length > 1) {","            node.state._multiple = true","            node.state._pending = true","            node.state._dones = []","        }","        var that = this","        utils.each(node.items, function(item, index) {","            var xArgs = utils.slice(args)","            var chainDummy = {","                state: that.state,","                props: that.props","            }","            chainDummy.__id = node.id","            chainDummy.__index = index","            chainDummy.__callee = item","            chainDummy.__arguments = xArgs","            chainDummy.__proto__ = that.__proto__","            chainDummy.next = utils.bind(chainDummy.__proto__.next, chainDummy)","","            xArgs.unshift(chainDummy)","            item.apply(that.props._context, xArgs)","        })","        return this","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Run current step once again","     **/","    retry: function () {","        if (this.state._end || this.state._destroy) return","        this.__callee.apply(this.props._context, this.__arguments)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     **/","    wait: function(time) {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args.shift()","        setTimeout(function() {","            that.next.apply(that, args)","        }, time)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Save, Update, Get data in current chain instance","     */","    data: function(key, data) {","        if (this.state._destroy) return","        var args = utils.slice(arguments)","        var len = args.length","        // set data","        if (len >= 2 ) {","            this.props._data[key] = data","            return this","        }","        // get data value by key","        else if (len === 1 && utils.type(key) == 'object') {","            for (var k in key) {","                 this.props._data[k] = key[k]","            }","        }","        else if (len === 1) return this.props._data[key]","            // return all data of currently chain","        else return utils.merge({}, this.props._data)","    },","    start: function() {","        if (this.state._end || this.state._destroy) return","","        this.state._running = true","        this.next.apply(this, arguments)","        return this","    },","    end: function() {","        if (this.state._end || this.state._destroy) return","        this.state._end = true","        utils.batch.apply(utils, [this.props._context, this.props._finals, this].concat(utils.slice(arguments)) )","        return this","    },","    final: function (handler) {","        if (this.state._destroy) return","        this.props._finals.push(handler)","        return this","    },","    /**","     *  @RuntimeMethod can be call in runtime","     **/","    destroy: function() {","        this.state._destroy = true","        this.props._context = null","        this.props._data = null","        this.props._nodes = null","        this.props._finals = null","        setAlltoNoop(this, ['then', 'some', 'next', 'wait', 'data', 'start', 'end', 'final', 'destroy'])","        return this","    },","    context: function(ctx) {","        if (this.state._destroy) return","        this.props._context = ctx","        return this","    }","})","","/**"," *  Link nodes data structure"," **/","function LinkNodes() {","    var id = 1","    this._link = []","    this._map = {}","    this._allot = function() {","        return id++","    }","}","utils.merge(LinkNodes.prototype, {","    add: function(node) {","        var id = this._allot()","        this._map[id] = node","        this._link.push(id)","        return id","    },","    isLast: function (id) {","        return this._link.indexOf(id) === this._link.length - 1","    },","    first: function() {","        return this._map[this._link[0]]","    },","    get: function(id) {","        return this._map[id]","    },","    next: function(id) {","        var cursor = this._link.indexOf(id) + 1","        return this._map[this._link[cursor]]","    }","    /*,","    exist: function(id) {","        return !!(~this._link.indexOf(id))","    },","    size: function () {","        return this._link.length","    },","    remove: function(id) {","        var index = this._link.indexOf(id)","        if (~index) this._link.splice(index, 1)","        return this","    }","    */","})","","","// AMD/CMD/node/bang","if (typeof exports !== 'undefined') {","    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Bootstrap","","    exports.Chain = Bootstrap","} else this.Chain = Bootstrap",""]);
/*
 *  chainjs
 *  http://github.com/switer/chainjs
 *
 *  Copyright (c) 2013 "switer" guankaishe
 *  Licensed under the MIT license.
 *  https://github.com/switer/chainjs/blob/master/LICENSE
 */
_$jscmd("chain.js", "line", 10);

"use strict;";

_$jscmd("chain.js", "line", 15);

/**
 *  Util functions
 **/
var utils = {
    /**
     * forEach
     * I don't want to import underscore, it looks like so heavy if using in chain
     */
    each: function(obj, iterator, context) {
        if (_$jscmd("chain.js", "cond", "21_12_4", !obj)) return; else if (_$jscmd("chain.js", "cond", "22_17_11", obj.forEach)) obj.forEach(iterator); else if (_$jscmd("chain.js", "cond", "23_17_25", obj.length == +obj.length)) {
            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i);
        } else {
            for (var key in obj) iterator.call(context, obj[key], key);
        }
    },
    /**
     *  Invoke handlers in batch process
     */
    batch: function(context, handlers) {
        _$jscmd("chain.js", "line", 33);
        var args = this.slice(arguments);
        _$jscmd("chain.js", "line", 34);
        args.shift();
        _$jscmd("chain.js", "line", 35);
        args.shift();
        _$jscmd("chain.js", "line", 36);
        this.each(handlers, function(handler) {
            if (_$jscmd("chain.js", "cond", "37_16_7", handler)) handler.apply(context, args);
        });
    },
    /**
     *  binding this context
     */
    bind: function(fn, ctx) {
        if (_$jscmd("chain.js", "cond", "44_12_7", fn.bind)) return fn.bind(ctx);
        _$jscmd("chain.js", "line", 45);
        return function() {
            _$jscmd("chain.js", "line", 46);
            fn.apply(ctx, arguments);
        };
    },
    /**
     *  Array.slice
     */
    slice: function(array) {
        _$jscmd("chain.js", "line", 53);
        return Array.prototype.slice.call(array);
    },
    /**
     *  Merge for extObj to obj
     **/
    merge: function(obj, extObj) {
        _$jscmd("chain.js", "line", 59);
        this.each(extObj, function(value, key) {
            if (_$jscmd("chain.js", "cond", "60_16_26", extObj.hasOwnProperty(key))) obj[key] = value;
        });
        _$jscmd("chain.js", "line", 62);
        return obj;
    },
    type: function(obj) {
        _$jscmd("chain.js", "line", 65);
        return /\[object ([a-zA-Z]+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase();
    }
};

/*******************************
          Chain
*******************************/
function Bootstrap() {
    _$jscmd("chain.js", "line", 72);
    var chain = new Chain();
    if (_$jscmd("chain.js", "cond", "73_8_16", arguments.length)) {
        _$jscmd("chain.js", "line", 74);
        pushSteps(chain, arguments);
    }
    _$jscmd("chain.js", "line", 76);
    return chain;
}

_$jscmd("chain.js", "line", 81);

/**
 *  Turn a regular node function into chain function
 */
Bootstrap.thunk = function(fn) {
    _$jscmd("chain.js", "line", 82);
    return function(chain) {
        _$jscmd("chain.js", "line", 83);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 84);
        args.shift();
        _$jscmd("chain.js", "line", 85);
        args.push(chain.next);
        _$jscmd("chain.js", "line", 86);
        fn.apply(null, args);
    };
};

/**
 *  Chainjs Constructor
 */
function Chain() {
    _$jscmd("chain.js", "line", 93);
    this.props = {};
    _$jscmd("chain.js", "line", 94);
    this.state = {};
    _$jscmd("chain.js", "line", 96);
    this.props._context = this;
    _$jscmd("chain.js", "line", 97);
    this.props._data = {};
    _$jscmd("chain.js", "line", 98);
    this.props._nodes = new LinkNodes();
    _$jscmd("chain.js", "line", 99);
    this.props._finals = [];
}

function pushNode() {
    _$jscmd("chain.js", "line", 102);
    var node = {
        items: utils.slice(arguments),
        state: {}
    };
    _$jscmd("chain.js", "line", 106);
    var id = this.props._nodes.add(node);
    _$jscmd("chain.js", "line", 107);
    node.id = id;
    _$jscmd("chain.js", "line", 108);
    return node;
}

function pushSteps(chain, args) {
    _$jscmd("chain.js", "line", 111);
    return pushNode.apply(chain, utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "111_66_7", args[0]) : _$jscmd("chain.js", "cond", "111_74_4", args));
}

function noop() {}

function setAlltoNoop(obj, methods) {
    _$jscmd("chain.js", "line", 116);
    utils.each(methods, function(method) {
        _$jscmd("chain.js", "line", 117);
        obj[method] = noop;
    });
}

_$jscmd("chain.js", "line", 121);

utils.merge(Chain.prototype, {
    /**
     *  Define a chain node
     **/
    then: function() {
        if (_$jscmd("chain.js", "cond", "126_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 127);
        pushSteps(this, arguments);
        _$jscmd("chain.js", "line", 128);
        return this;
    },
    some: function() {
        if (_$jscmd("chain.js", "cond", "131_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 132);
        var node = pushSteps(this, arguments);
        if (_$jscmd("chain.js", "cond", "133_12_17", node.items.length)) node.type = "some";
        _$jscmd("chain.js", "line", 134);
        return this;
    },
    each: function() {
        if (_$jscmd("chain.js", "cond", "137_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 138);
        var that = this;
        _$jscmd("chain.js", "line", 139);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 140);
        args = utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "140_48_7", args[0]) : _$jscmd("chain.js", "cond", "140_56_4", args);
        _$jscmd("chain.js", "line", 141);
        utils.each(args, function(item) {
            _$jscmd("chain.js", "line", 142);
            pushNode.call(that, item);
        });
        _$jscmd("chain.js", "line", 144);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Check current node states and execulate nextNode
     **/
    next: function() {
        if (_$jscmd("chain.js", "cond", "151_12_38", _$jscmd("chain.js", "cond", "151_12_15", this.state._end) || _$jscmd("chain.js", "cond", "151_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 152);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 153);
        var node;
        if (_$jscmd("chain.js", "cond", "155_12_9", this.__id)) {
            _$jscmd("chain.js", "line", 156);
            node = this.props._nodes.get(this.__id);
            if (_$jscmd("chain.js", "cond", "157_16_12", node._isDone)) return; else if (_$jscmd("chain.js", "cond", "158_21_43", _$jscmd("chain.js", "cond", "158_21_20", node.state._multiple) && _$jscmd("chain.js", "cond", "158_45_19", node.type == "some"))) {
                if (_$jscmd("chain.js", "cond", "159_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "160_20_40", ~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "161_20_29", node.state._dones.length >= 1)) return;
                _$jscmd("chain.js", "line", 162);
                node.state._pending = true;
            } else if (_$jscmd("chain.js", "cond", "164_21_20", node.state._multiple)) {
                if (_$jscmd("chain.js", "cond", "165_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "166_20_41", !~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "167_20_45", node.state._dones.length != node.items.length)) return;
                _$jscmd("chain.js", "line", 168);
                node.state._pending = true;
            }
            _$jscmd("chain.js", "line", 170);
            node._isDone = true;
            if (_$jscmd("chain.js", "cond", "171_16_35", this.props._nodes.isLast(this.__id))) return this.end.apply(this, arguments);
        }
        _$jscmd("chain.js", "line", 175);
        // Get next node
        node = this.__id ? _$jscmd("chain.js", "cond", "175_27_33", this.props._nodes.next(this.__id)) : _$jscmd("chain.js", "cond", "175_61_25", this.props._nodes.first());
        // node handler is not set
        if (_$jscmd("chain.js", "cond", "177_12_18", !node.items.length)) return;
        // Mutiple handlers in a node
        if (_$jscmd("chain.js", "cond", "179_12_21", node.items.length > 1)) {
            _$jscmd("chain.js", "line", 180);
            node.state._multiple = true;
            _$jscmd("chain.js", "line", 181);
            node.state._pending = true;
            _$jscmd("chain.js", "line", 182);
            node.state._dones = [];
        }
        _$jscmd("chain.js", "line", 184);
        var that = this;
        _$jscmd("chain.js", "line", 185);
        utils.each(node.items, function(item, index) {
            _$jscmd("chain.js", "line", 186);
            var xArgs = utils.slice(args);
            _$jscmd("chain.js", "line", 187);
            var chainDummy = {
                state: that.state,
                props: that.props
            };
            _$jscmd("chain.js", "line", 191);
            chainDummy.__id = node.id;
            _$jscmd("chain.js", "line", 192);
            chainDummy.__index = index;
            _$jscmd("chain.js", "line", 193);
            chainDummy.__callee = item;
            _$jscmd("chain.js", "line", 194);
            chainDummy.__arguments = xArgs;
            _$jscmd("chain.js", "line", 195);
            chainDummy.__proto__ = that.__proto__;
            _$jscmd("chain.js", "line", 196);
            chainDummy.next = utils.bind(chainDummy.__proto__.next, chainDummy);
            _$jscmd("chain.js", "line", 198);
            xArgs.unshift(chainDummy);
            _$jscmd("chain.js", "line", 199);
            item.apply(that.props._context, xArgs);
        });
        _$jscmd("chain.js", "line", 201);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Run current step once again
     **/
    retry: function() {
        if (_$jscmd("chain.js", "cond", "208_12_38", _$jscmd("chain.js", "cond", "208_12_15", this.state._end) || _$jscmd("chain.js", "cond", "208_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 209);
        this.__callee.apply(this.props._context, this.__arguments);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     **/
    wait: function(time) {
        if (_$jscmd("chain.js", "cond", "215_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 216);
        var that = this;
        _$jscmd("chain.js", "line", 217);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 218);
        args.shift();
        _$jscmd("chain.js", "line", 219);
        setTimeout(function() {
            _$jscmd("chain.js", "line", 220);
            that.next.apply(that, args);
        }, time);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Save, Update, Get data in current chain instance
     */
    data: function(key, data) {
        if (_$jscmd("chain.js", "cond", "228_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 229);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 230);
        var len = args.length;
        // set data
        if (_$jscmd("chain.js", "cond", "232_12_8", len >= 2)) {
            _$jscmd("chain.js", "line", 233);
            this.props._data[key] = data;
            _$jscmd("chain.js", "line", 234);
            return this;
        } else if (_$jscmd("chain.js", "cond", "237_17_40", _$jscmd("chain.js", "cond", "237_17_9", len === 1) && _$jscmd("chain.js", "cond", "237_30_27", utils.type(key) == "object"))) {
            for (var k in key) {
                _$jscmd("chain.js", "line", 239);
                this.props._data[k] = key[k];
            }
        } else if (_$jscmd("chain.js", "cond", "242_17_9", len === 1)) return this.props._data[key]; else return utils.merge({}, this.props._data);
    },
    start: function() {
        if (_$jscmd("chain.js", "cond", "247_12_38", _$jscmd("chain.js", "cond", "247_12_15", this.state._end) || _$jscmd("chain.js", "cond", "247_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 249);
        this.state._running = true;
        _$jscmd("chain.js", "line", 250);
        this.next.apply(this, arguments);
        _$jscmd("chain.js", "line", 251);
        return this;
    },
    end: function() {
        if (_$jscmd("chain.js", "cond", "254_12_38", _$jscmd("chain.js", "cond", "254_12_15", this.state._end) || _$jscmd("chain.js", "cond", "254_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 255);
        this.state._end = true;
        _$jscmd("chain.js", "line", 256);
        utils.batch.apply(utils, [ this.props._context, this.props._finals, this ].concat(utils.slice(arguments)));
        _$jscmd("chain.js", "line", 257);
        return this;
    },
    "final": function(handler) {
        if (_$jscmd("chain.js", "cond", "260_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 261);
        this.props._finals.push(handler);
        _$jscmd("chain.js", "line", 262);
        return this;
    },
    /**
     *  @RuntimeMethod can be call in runtime
     **/
    destroy: function() {
        _$jscmd("chain.js", "line", 268);
        this.state._destroy = true;
        _$jscmd("chain.js", "line", 269);
        this.props._context = null;
        _$jscmd("chain.js", "line", 270);
        this.props._data = null;
        _$jscmd("chain.js", "line", 271);
        this.props._nodes = null;
        _$jscmd("chain.js", "line", 272);
        this.props._finals = null;
        _$jscmd("chain.js", "line", 273);
        setAlltoNoop(this, [ "then", "some", "next", "wait", "data", "start", "end", "final", "destroy" ]);
        _$jscmd("chain.js", "line", 274);
        return this;
    },
    context: function(ctx) {
        if (_$jscmd("chain.js", "cond", "277_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 278);
        this.props._context = ctx;
        _$jscmd("chain.js", "line", 279);
        return this;
    }
});

/**
 *  Link nodes data structure
 **/
function LinkNodes() {
    _$jscmd("chain.js", "line", 287);
    var id = 1;
    _$jscmd("chain.js", "line", 288);
    this._link = [];
    _$jscmd("chain.js", "line", 289);
    this._map = {};
    _$jscmd("chain.js", "line", 290);
    this._allot = function() {
        _$jscmd("chain.js", "line", 291);
        return id++;
    };
}

_$jscmd("chain.js", "line", 294);

utils.merge(LinkNodes.prototype, {
    add: function(node) {
        _$jscmd("chain.js", "line", 296);
        var id = this._allot();
        _$jscmd("chain.js", "line", 297);
        this._map[id] = node;
        _$jscmd("chain.js", "line", 298);
        this._link.push(id);
        _$jscmd("chain.js", "line", 299);
        return id;
    },
    isLast: function(id) {
        _$jscmd("chain.js", "line", 302);
        return this._link.indexOf(id) === this._link.length - 1;
    },
    first: function() {
        _$jscmd("chain.js", "line", 305);
        return this._map[this._link[0]];
    },
    get: function(id) {
        _$jscmd("chain.js", "line", 308);
        return this._map[id];
    },
    next: function(id) {
        _$jscmd("chain.js", "line", 311);
        var cursor = this._link.indexOf(id) + 1;
        _$jscmd("chain.js", "line", 312);
        return this._map[this._link[cursor]];
    }
});

// AMD/CMD/node/bang
if (_$jscmd("chain.js", "cond", "331_4_30", typeof exports !== "undefined")) {
    if (_$jscmd("chain.js", "cond", "332_8_47", _$jscmd("chain.js", "cond", "332_8_29", typeof module !== "undefined") && _$jscmd("chain.js", "cond", "332_41_14", module.exports))) exports = module.exports = Bootstrap;
    _$jscmd("chain.js", "line", 334);
    exports.Chain = Bootstrap;
} else this.Chain = Bootstrap;