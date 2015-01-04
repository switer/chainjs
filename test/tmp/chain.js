
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
})('chain.js', [10,15,101,273,33,34,35,36,44,50,53,56,63,67,65,73,74,76,77,78,79,82,86,87,88,91,96,97,107,108,112,114,118,119,120,121,124,122,132,133,155,164,179,136,150,142,148,160,161,162,165,166,170,171,172,173,174,176,177,188,195,196,197,198,199,208,209,212,213,218,228,229,230,234,235,236,240,241,247,248,249,250,251,252,253,257,258,266,267,268,269,270,275,276,277,278,281,284,287,290,291,313], {"21_12_4":0,"22_17_11":0,"23_17_25":0,"37_16_7":0,"51_16_26":0,"64_8_16":0,"91_66_7":0,"91_74_4":0,"106_12_19":0,"111_12_19":0,"113_12_17":0,"117_12_19":0,"120_48_7":0,"120_56_4":0,"131_12_38":0,"131_12_15":0,"131_31_19":0,"135_12_9":0,"137_16_12":0,"138_21_43":0,"138_21_20":0,"138_45_19":0,"139_20_20":0,"140_20_40":0,"141_20_29":0,"144_21_20":0,"145_20_20":0,"146_20_41":0,"147_20_45":0,"151_16_35":0,"155_27_33":0,"155_61_25":0,"157_12_18":0,"159_12_21":0,"187_12_38":0,"187_12_15":0,"187_31_19":0,"194_12_19":0,"207_12_19":0,"211_12_8":0,"216_17_40":0,"216_17_9":0,"216_30_27":0,"221_17_9":0,"226_12_38":0,"226_12_15":0,"226_31_19":0,"233_12_38":0,"233_12_15":0,"233_31_19":0,"239_12_19":0,"256_12_19":0,"310_4_30":0,"311_8_47":0,"311_8_29":0,"311_41_14":0}, ["/*"," *  chainjs"," *  http://github.com/switer/chainjs"," *"," *  Copyright (c) 2013 \"switer\" guankaishe"," *  Licensed under the MIT license."," *  https://github.com/switer/chainjs/blob/master/LICENSE"," */","","'use strict;'","","/**"," *  Util functions"," **/","var utils = {","    /**","     * forEach","     * I don't want to import underscore, it looks like so heavy if using in chain","     */","    each: function(obj, iterator, context) {","        if (!obj) return","        else if (obj.forEach) obj.forEach(iterator)","        else if (obj.length == +obj.length) {","            for (var i = 0; i < obj.length; i++) iterator.call(context, obj[i], i)","        } else {","            for (var key in obj) iterator.call(context, obj[key], key)","        }","    },","    /**","     *  Invoke handlers in batch process","     */","    batch: function(context, handlers/*, params*/ ) {","        var args = this.slice(arguments)","        args.shift()","        args.shift()","        this.each(handlers, function(handler) {","            if (handler) handler.apply(context, args)","        })","    },","    /**","     *  Array.slice","     */","    slice: function(array) {","        return Array.prototype.slice.call(array)","    },","    /**","     *  Merge for extObj to obj","     **/","    merge: function(obj, extObj) {","        this.each(extObj, function(value, key) {","            if (extObj.hasOwnProperty(key)) obj[key] = value","        })","        return obj","    },","    type: function (obj) {","        return /\\[object ([a-zA-Z]+)\\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase()","    }","}","/*******************************","          Chain","*******************************/","function Bootstrap () {","    var chain = new Chain()","    if (arguments.length) {","        pushSteps(chain, arguments)","    }","    return chain","}","/**"," *  Chainjs Constructor"," */","function Chain() {","    this.props = {}","    this.state = {}","","    this.props._context = this","    this.props._data = {}","    this.props._nodes = new LinkNodes()","    this.props._finals =[]","}","function pushNode( /*handler1, handler2, ..., handlerN*/ ) {","    var node = {","        items: utils.slice(arguments),","        state: {}","    }","    var id = this.props._nodes.add(node)","    node.id = id","    return node","}","function pushSteps (chain, args) {","    return pushNode.apply(chain, utils.type(args[0]) == 'array' ? args[0]:args)","}","","function noop () {}","function setAlltoNoop (obj, methods) {","    utils.each(methods, function (method) {","        obj[method] = noop","    })","}","","utils.merge(Chain.prototype, {","    /**","     *  Define a chain node","     **/","    then: function() {","        if (this.state._destroy) return","        pushSteps(this, arguments)","        return this","    },","    some: function() {","        if (this.state._destroy) return","        var node = pushSteps(this, arguments)","        if (node.items.length) node.type = 'some'","        return this","    },","    each: function () {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args = utils.type(args[0]) == 'array' ? args[0]:args","        args.forEach(function (item) {","            pushNode.call(that, item)","        })","        return this","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Check current node states and execulate nextNode","     **/","    next: function() {","        if (this.state._end || this.state._destroy) return","        var args = utils.slice(arguments)","        var node","","        if (this.__id) {","            node = this.props._nodes.get(this.__id)","            if (node._isDone) return","            else if (node.state._multiple && node.type == 'some') {","                if (!node.state._pending) return","                if (~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length >= 1) return","                node.state._pending = true","            } ","            else if (node.state._multiple) {","                if (!node.state._pending) return","                if (!~node.state._dones.indexOf(this.__index)) node.state._dones.push(this.__index)","                if (node.state._dones.length != node.items.length) return","                node.state._pending = true","            }","            node._isDone = true","            if (this.props._nodes.isLast(this.__id)) return this.end.apply(this, arguments)","        }","","        // Get next node","        node = this.__id ? this.props._nodes.next(this.__id):this.props._nodes.first()","        // node handler is not set","        if (!node.items.length) return","        // Mutiple handlers in a node","        if (node.items.length > 1) {","            node.state._multiple = true","            node.state._pending = true","            node.state._dones = []","        }","        utils.each(node.items, function(item, index) {","            var xArgs = args.slice()","            var chainDummy = {","                state: this.state,","                props: this.props","            }","            chainDummy.__id = node.id","            chainDummy.__index = index","            chainDummy.__callee = item","            chainDummy.__arguments = xArgs","            chainDummy.__proto__ = this.__proto__","","            xArgs.unshift(chainDummy)","            item.apply(this.props._context, xArgs)","        }.bind(this))","        return this","    },","","    /**","     *  @RuntimeMethod only be called in runtime","     *  Run current step once again","     **/","    retry: function () {","        if (this.state._end || this.state._destroy) return","        this.__callee.apply(this.props._context, this.__arguments)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     **/","    wait: function(time) {","        if (this.state._destroy) return","        var that = this","        var args = utils.slice(arguments)","        args.shift()","        setTimeout(function() {","            that.next.apply(that, args)","        }, time)","    },","    /**","     *  @RuntimeMethod only be called in runtime","     *  Save, Update, Get data in current chain instance","     */","    data: function(key, data) {","        if (this.state._destroy) return","        var args = utils.slice(arguments)","        var len = args.length","        // set data","        if (len >= 2 ) {","            this.props._data[key] = data","            return this","        }","        // get data value by key","        else if (len === 1 && utils.type(key) == 'object') {","            for (var k in key) {","                 this.props._data[k] = key[k]","            }","        }","        else if (len === 1) return this.props._data[key]","            // return all data of currently chain","        else return utils.merge({}, this.props._data)","    },","    start: function() {","        if (this.state._end || this.state._destroy) return","","        this.state._running = true","        this.next.apply(this, arguments)","        return this","    },","    end: function() {","        if (this.state._end || this.state._destroy) return","        this.state._end = true","        utils.batch.apply(utils, [this.props._context, this.props._finals, this].concat(utils.slice(arguments)) )","        return this","    },","    final: function (handler) {","        if (this.state._destroy) return","        this.props._finals.push(handler)","        return this","    },","    /**","     *  @RuntimeMethod can be call in runtime","     **/","    destroy: function() {","        this.state._destroy = true","        this.props._context = null","        this.props._data = null","        this.props._nodes = null","        this.props._finals = null","        setAlltoNoop(this, ['then', 'some', 'next', 'wait', 'data', 'start', 'end', 'final', 'destroy'])","        return this","    },","    context: function(ctx) {","        if (this.state._destroy) return","        this.props._context = ctx","        return this","    }","})","","/**"," *  Link nodes data structure"," **/","function LinkNodes() {","    var id = 1","    this._link = []","    this._map = {}","    this._allot = function() {","        return id++","    }","}","utils.merge(LinkNodes.prototype, {","    add: function(node) {","        var id = this._allot()","        this._map[id] = node","        this._link.push(id)","        return id","    },","    isLast: function (id) {","        return this._link.indexOf(id) === this._link.length - 1","    },","    first: function() {","        return this._map[this._link[0]]","    },","    get: function(id) {","        return this._map[id]","    },","    next: function(id) {","        var cursor = this._link.indexOf(id) + 1","        return this._map[this._link[cursor]]","    }","    /*,","    exist: function(id) {","        return !!(~this._link.indexOf(id))","    },","    size: function () {","        return this._link.length","    },","    remove: function(id) {","        var index = this._link.indexOf(id)","        if (~index) this._link.splice(index, 1)","        return this","    }","    */","})","","","// AMD/CMD/node/bang","if (typeof exports !== 'undefined') {","    if (typeof module !== 'undefined' && module.exports) exports = module.exports = Bootstrap","","    exports.Chain = Bootstrap","} else this.Chain = Bootstrap",""]);
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
     *  Array.slice
     */
    slice: function(array) {
        _$jscmd("chain.js", "line", 44);
        return Array.prototype.slice.call(array);
    },
    /**
     *  Merge for extObj to obj
     **/
    merge: function(obj, extObj) {
        _$jscmd("chain.js", "line", 50);
        this.each(extObj, function(value, key) {
            if (_$jscmd("chain.js", "cond", "51_16_26", extObj.hasOwnProperty(key))) obj[key] = value;
        });
        _$jscmd("chain.js", "line", 53);
        return obj;
    },
    type: function(obj) {
        _$jscmd("chain.js", "line", 56);
        return /\[object ([a-zA-Z]+)\]/.exec(Object.prototype.toString.call(obj))[1].toLowerCase();
    }
};

/*******************************
          Chain
*******************************/
function Bootstrap() {
    _$jscmd("chain.js", "line", 63);
    var chain = new Chain();
    if (_$jscmd("chain.js", "cond", "64_8_16", arguments.length)) {
        _$jscmd("chain.js", "line", 65);
        pushSteps(chain, arguments);
    }
    _$jscmd("chain.js", "line", 67);
    return chain;
}

/**
 *  Chainjs Constructor
 */
function Chain() {
    _$jscmd("chain.js", "line", 73);
    this.props = {};
    _$jscmd("chain.js", "line", 74);
    this.state = {};
    _$jscmd("chain.js", "line", 76);
    this.props._context = this;
    _$jscmd("chain.js", "line", 77);
    this.props._data = {};
    _$jscmd("chain.js", "line", 78);
    this.props._nodes = new LinkNodes();
    _$jscmd("chain.js", "line", 79);
    this.props._finals = [];
}

function pushNode() {
    _$jscmd("chain.js", "line", 82);
    var node = {
        items: utils.slice(arguments),
        state: {}
    };
    _$jscmd("chain.js", "line", 86);
    var id = this.props._nodes.add(node);
    _$jscmd("chain.js", "line", 87);
    node.id = id;
    _$jscmd("chain.js", "line", 88);
    return node;
}

function pushSteps(chain, args) {
    _$jscmd("chain.js", "line", 91);
    return pushNode.apply(chain, utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "91_66_7", args[0]) : _$jscmd("chain.js", "cond", "91_74_4", args));
}

function noop() {}

function setAlltoNoop(obj, methods) {
    _$jscmd("chain.js", "line", 96);
    utils.each(methods, function(method) {
        _$jscmd("chain.js", "line", 97);
        obj[method] = noop;
    });
}

_$jscmd("chain.js", "line", 101);

utils.merge(Chain.prototype, {
    /**
     *  Define a chain node
     **/
    then: function() {
        if (_$jscmd("chain.js", "cond", "106_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 107);
        pushSteps(this, arguments);
        _$jscmd("chain.js", "line", 108);
        return this;
    },
    some: function() {
        if (_$jscmd("chain.js", "cond", "111_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 112);
        var node = pushSteps(this, arguments);
        if (_$jscmd("chain.js", "cond", "113_12_17", node.items.length)) node.type = "some";
        _$jscmd("chain.js", "line", 114);
        return this;
    },
    each: function() {
        if (_$jscmd("chain.js", "cond", "117_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 118);
        var that = this;
        _$jscmd("chain.js", "line", 119);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 120);
        args = utils.type(args[0]) == "array" ? _$jscmd("chain.js", "cond", "120_48_7", args[0]) : _$jscmd("chain.js", "cond", "120_56_4", args);
        _$jscmd("chain.js", "line", 121);
        args.forEach(function(item) {
            _$jscmd("chain.js", "line", 122);
            pushNode.call(that, item);
        });
        _$jscmd("chain.js", "line", 124);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Check current node states and execulate nextNode
     **/
    next: function() {
        if (_$jscmd("chain.js", "cond", "131_12_38", _$jscmd("chain.js", "cond", "131_12_15", this.state._end) || _$jscmd("chain.js", "cond", "131_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 132);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 133);
        var node;
        if (_$jscmd("chain.js", "cond", "135_12_9", this.__id)) {
            _$jscmd("chain.js", "line", 136);
            node = this.props._nodes.get(this.__id);
            if (_$jscmd("chain.js", "cond", "137_16_12", node._isDone)) return; else if (_$jscmd("chain.js", "cond", "138_21_43", _$jscmd("chain.js", "cond", "138_21_20", node.state._multiple) && _$jscmd("chain.js", "cond", "138_45_19", node.type == "some"))) {
                if (_$jscmd("chain.js", "cond", "139_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "140_20_40", ~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "141_20_29", node.state._dones.length >= 1)) return;
                _$jscmd("chain.js", "line", 142);
                node.state._pending = true;
            } else if (_$jscmd("chain.js", "cond", "144_21_20", node.state._multiple)) {
                if (_$jscmd("chain.js", "cond", "145_20_20", !node.state._pending)) return;
                if (_$jscmd("chain.js", "cond", "146_20_41", !~node.state._dones.indexOf(this.__index))) node.state._dones.push(this.__index);
                if (_$jscmd("chain.js", "cond", "147_20_45", node.state._dones.length != node.items.length)) return;
                _$jscmd("chain.js", "line", 148);
                node.state._pending = true;
            }
            _$jscmd("chain.js", "line", 150);
            node._isDone = true;
            if (_$jscmd("chain.js", "cond", "151_16_35", this.props._nodes.isLast(this.__id))) return this.end.apply(this, arguments);
        }
        _$jscmd("chain.js", "line", 155);
        // Get next node
        node = this.__id ? _$jscmd("chain.js", "cond", "155_27_33", this.props._nodes.next(this.__id)) : _$jscmd("chain.js", "cond", "155_61_25", this.props._nodes.first());
        // node handler is not set
        if (_$jscmd("chain.js", "cond", "157_12_18", !node.items.length)) return;
        // Mutiple handlers in a node
        if (_$jscmd("chain.js", "cond", "159_12_21", node.items.length > 1)) {
            _$jscmd("chain.js", "line", 160);
            node.state._multiple = true;
            _$jscmd("chain.js", "line", 161);
            node.state._pending = true;
            _$jscmd("chain.js", "line", 162);
            node.state._dones = [];
        }
        _$jscmd("chain.js", "line", 164);
        utils.each(node.items, function(item, index) {
            _$jscmd("chain.js", "line", 165);
            var xArgs = args.slice();
            _$jscmd("chain.js", "line", 166);
            var chainDummy = {
                state: this.state,
                props: this.props
            };
            _$jscmd("chain.js", "line", 170);
            chainDummy.__id = node.id;
            _$jscmd("chain.js", "line", 171);
            chainDummy.__index = index;
            _$jscmd("chain.js", "line", 172);
            chainDummy.__callee = item;
            _$jscmd("chain.js", "line", 173);
            chainDummy.__arguments = xArgs;
            _$jscmd("chain.js", "line", 174);
            chainDummy.__proto__ = this.__proto__;
            _$jscmd("chain.js", "line", 176);
            xArgs.unshift(chainDummy);
            _$jscmd("chain.js", "line", 177);
            item.apply(this.props._context, xArgs);
        }.bind(this));
        _$jscmd("chain.js", "line", 179);
        return this;
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Run current step once again
     **/
    retry: function() {
        if (_$jscmd("chain.js", "cond", "187_12_38", _$jscmd("chain.js", "cond", "187_12_15", this.state._end) || _$jscmd("chain.js", "cond", "187_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 188);
        this.__callee.apply(this.props._context, this.__arguments);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     **/
    wait: function(time) {
        if (_$jscmd("chain.js", "cond", "194_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 195);
        var that = this;
        _$jscmd("chain.js", "line", 196);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 197);
        args.shift();
        _$jscmd("chain.js", "line", 198);
        setTimeout(function() {
            _$jscmd("chain.js", "line", 199);
            that.next.apply(that, args);
        }, time);
    },
    /**
     *  @RuntimeMethod only be called in runtime
     *  Save, Update, Get data in current chain instance
     */
    data: function(key, data) {
        if (_$jscmd("chain.js", "cond", "207_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 208);
        var args = utils.slice(arguments);
        _$jscmd("chain.js", "line", 209);
        var len = args.length;
        // set data
        if (_$jscmd("chain.js", "cond", "211_12_8", len >= 2)) {
            _$jscmd("chain.js", "line", 212);
            this.props._data[key] = data;
            _$jscmd("chain.js", "line", 213);
            return this;
        } else if (_$jscmd("chain.js", "cond", "216_17_40", _$jscmd("chain.js", "cond", "216_17_9", len === 1) && _$jscmd("chain.js", "cond", "216_30_27", utils.type(key) == "object"))) {
            for (var k in key) {
                _$jscmd("chain.js", "line", 218);
                this.props._data[k] = key[k];
            }
        } else if (_$jscmd("chain.js", "cond", "221_17_9", len === 1)) return this.props._data[key]; else return utils.merge({}, this.props._data);
    },
    start: function() {
        if (_$jscmd("chain.js", "cond", "226_12_38", _$jscmd("chain.js", "cond", "226_12_15", this.state._end) || _$jscmd("chain.js", "cond", "226_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 228);
        this.state._running = true;
        _$jscmd("chain.js", "line", 229);
        this.next.apply(this, arguments);
        _$jscmd("chain.js", "line", 230);
        return this;
    },
    end: function() {
        if (_$jscmd("chain.js", "cond", "233_12_38", _$jscmd("chain.js", "cond", "233_12_15", this.state._end) || _$jscmd("chain.js", "cond", "233_31_19", this.state._destroy))) return;
        _$jscmd("chain.js", "line", 234);
        this.state._end = true;
        _$jscmd("chain.js", "line", 235);
        utils.batch.apply(utils, [ this.props._context, this.props._finals, this ].concat(utils.slice(arguments)));
        _$jscmd("chain.js", "line", 236);
        return this;
    },
    "final": function(handler) {
        if (_$jscmd("chain.js", "cond", "239_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 240);
        this.props._finals.push(handler);
        _$jscmd("chain.js", "line", 241);
        return this;
    },
    /**
     *  @RuntimeMethod can be call in runtime
     **/
    destroy: function() {
        _$jscmd("chain.js", "line", 247);
        this.state._destroy = true;
        _$jscmd("chain.js", "line", 248);
        this.props._context = null;
        _$jscmd("chain.js", "line", 249);
        this.props._data = null;
        _$jscmd("chain.js", "line", 250);
        this.props._nodes = null;
        _$jscmd("chain.js", "line", 251);
        this.props._finals = null;
        _$jscmd("chain.js", "line", 252);
        setAlltoNoop(this, [ "then", "some", "next", "wait", "data", "start", "end", "final", "destroy" ]);
        _$jscmd("chain.js", "line", 253);
        return this;
    },
    context: function(ctx) {
        if (_$jscmd("chain.js", "cond", "256_12_19", this.state._destroy)) return;
        _$jscmd("chain.js", "line", 257);
        this.props._context = ctx;
        _$jscmd("chain.js", "line", 258);
        return this;
    }
});

/**
 *  Link nodes data structure
 **/
function LinkNodes() {
    _$jscmd("chain.js", "line", 266);
    var id = 1;
    _$jscmd("chain.js", "line", 267);
    this._link = [];
    _$jscmd("chain.js", "line", 268);
    this._map = {};
    _$jscmd("chain.js", "line", 269);
    this._allot = function() {
        _$jscmd("chain.js", "line", 270);
        return id++;
    };
}

_$jscmd("chain.js", "line", 273);

utils.merge(LinkNodes.prototype, {
    add: function(node) {
        _$jscmd("chain.js", "line", 275);
        var id = this._allot();
        _$jscmd("chain.js", "line", 276);
        this._map[id] = node;
        _$jscmd("chain.js", "line", 277);
        this._link.push(id);
        _$jscmd("chain.js", "line", 278);
        return id;
    },
    isLast: function(id) {
        _$jscmd("chain.js", "line", 281);
        return this._link.indexOf(id) === this._link.length - 1;
    },
    first: function() {
        _$jscmd("chain.js", "line", 284);
        return this._map[this._link[0]];
    },
    get: function(id) {
        _$jscmd("chain.js", "line", 287);
        return this._map[id];
    },
    next: function(id) {
        _$jscmd("chain.js", "line", 290);
        var cursor = this._link.indexOf(id) + 1;
        _$jscmd("chain.js", "line", 291);
        return this._map[this._link[cursor]];
    }
});

// AMD/CMD/node/bang
if (_$jscmd("chain.js", "cond", "310_4_30", typeof exports !== "undefined")) {
    if (_$jscmd("chain.js", "cond", "311_8_47", _$jscmd("chain.js", "cond", "311_8_29", typeof module !== "undefined") && _$jscmd("chain.js", "cond", "311_41_14", module.exports))) exports = module.exports = Bootstrap;
    _$jscmd("chain.js", "line", 313);
    exports.Chain = Bootstrap;
} else this.Chain = Bootstrap;