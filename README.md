chainjs
=======
![logo](http://switer.qiniudn.com/chain.png)

[![Build Status](https://travis-ci.org/switer/chainjs.svg?branch=master)](https://travis-ci.org/switer/chainjs)
[![Coverage Status](https://coveralls.io/repos/switer/chainjs/badge.svg?branch=master)](https://coveralls.io/r/switer/chainjs?branch=master)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/switer/chainjs?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/chainjs.svg)](http://badge.fury.io/js/chainjs)

An asynchronous callback's flow controller, chaining async function callbacks. Async methods calling flow make easy. I use it in node.js server and webapp.

## Install

```bash
npm install chainjs --save
```

## Usage
:two_men_holding_hands: :two_men_holding_hands: :two_men_holding_hands:

**Chainjs** can be used in [node.js](nodejs.org) or browser . Use in node as below:

```javascript
var Chain = require('chainjs')

Chain(function (chain, data) {
        // initialize
        console.log(data) // --> {name: 'Chainjs'}
        chain.next();
    })
    .then(function (chain) {
        chain.nextTo('branchStep')
    })
    .then(function (chain, data) {
        var count = chain.data('count' || 0)
        if (count > 2) {
            chain.next('thenStep')
        } else {
            setTimeout(function () {
                chain.data('count', count ++).retry()
            })
        }       
    })
    .branch('branchStep', function (chain) {
        chain.next('branchStep')
    })
    .then(function (chain, from) {
        if (from == 'branchStep') {
            // do something
        }
        chain.next()
    })
    .final(function (chain, data) {
       // do something when chain is ending
    })
    .start({name: 'Chainjs'})
```
:walking: :walking: :walking: :walking: :walking: :walking:
-----------------------------------------------------------
**Look at the diagram of above chain-flow:**

![diagram](http://switer.qiniudn.com/chain-flow.png)

## API
Each step's handler has been passed the `chain` instance as the first argument.

* Global API
    - [Chain()](#chainfunc-func1--funcn)
    - [then()](#thenfunc-func1--funcn)
    - [some()](#somefunc-func1--funcn)
    - [each()](#eachfunc-func1--funcn)
    - [branch()](#branchbranchname-func)
    - [context()](#contextctx)
    - [thunk()](#thunkfunc)
    - [start()](#startdata-data1--datan)
    - [final()](#finalfinalhandler)

* Instance API
    - [next()](#nextdata-data1--datan)
    - [nextTo()](#nexttobranchname-data-data1--datan)
    - [wait()](#waittime-data-data1--datan)
    - [end()](#enddata-data1--datan)
    - [data()](#datasavingdata)
    - [retry()](#retry)
    - [destroy()](#destroy)



### Chain(func, ..., funcN)

**[API Reference](#api)**

Create a Chain instance.
* if arguments is not empty, it will be call **.then()** with arguments automatically.
* else If first param is type of `Array`, then first param will be passed as arguments.
```javascript
Chain(func /*, ..., funcN*/);
// or 
Chain([func, func1, funcN])
```

### .then(func, ..., funcN)

**[API Reference](#api)**

Define a chain step, if a then step has multiple functions, it need each function call chain.next() to goto next step.
```javascript
Chain().then(funcA1, funcA2, funcA3).then(func1)
```
If first argument is type of `Array`, that argument will be passed as arguments.
```javascript
Chain.then([func, ..., funcN])
// equal to 
Chain.then(func, ..., funcN)
```


### .retry()

**[API Reference](#api)**

Call current function once again (use for recursive).
```javascript
var flag
Chain(function (chain, data) {
    if (flag) {
        return chain.next()
    }
    flag = true
    chain.retry()
}).start('value')
```

### .some(func, ..., funcN)

**[API Reference](#api)**

Define a chain step, if a then step has multiple functions, it need any function of this step calling chain.next() only once to goto next step.
```javascript
Chain(func).some(function (chain) {
    setTimeout(function () {
        chain.next()
    }, 100)
}, function (chain) {
    setTimeout(function () {
        chain.next()
    }, 1000)
}, function (chain) {
    setTimeout(function () {
        chain.next()
    }, 500)
}).then(function () {
    // this step will be run after 100ms.
})
```
If first argument is type of `Array`, that argument will be passed as arguments.
```javascript
Chain.some([func1, func2, ..., funcN])
// equal to 
Chain.some(func1, func2, ..., funcN)
```

### .each(func, ..., funcN)

**[API Reference](#api)**

Define a chain step, call each handlers of this step in sequence. In this step, each function call chain.next() to call next function. In orders from left to right of arguments
```javascript
Chain(func).then(func1).each(funcA1, funcA2, funcA3)
```
If first argument is type of `Array`, that argument will be passed as arguments.
```javascript
Chain.each([func1, func2, ..., funcN])
// equal to 
Chain.each(func1, func2, ..., funcN)
```

### .start(data, ..., dataN)

**[API Reference](#api)**

Start running the chain, and could pass data to initial step.
```javascript
Chain(function (chain, initData) {
    
}).then(func1).then(func2).start(initData);
```

### .destroy()

**[API Reference](#api)**

Destroy the chain, mark the chain as ending and destroy local variable, but don't calling final funtions.

__notice:__ after use chain.destroy(), the chain contiue execute current step handler, 
so use with return for stoping current step excution
```javascript
Chain(func).then(function (chain) {
    chain.destroy();
    return;
}).start();
```

### .next(data, ..., dataN)

**[API Reference](#api)**

Go to next step
```javascript
chain.next();
// pass params to next step handler
chain.next(data);
```

### .branch(branchName, func)

**[API Reference](#api)**

Define a branch step, only using `chain.nextTo(branchName)` to goto branch step. 
Call `chain.next()` from last step will skip next branch step.
```
     -------------o
     |            ↓
o----o----->o---->o---->o
```

```javascript
Chain(function (chain) {
    chain.nextTo('branchA')
    chain.next()
}).then(function (chain) {
    throw new Error('This step should not be called')
}).branch('branchA', function (chain) {
    chain.next()
}).branch('branchB', function (chain) {
    throw new Error('This step should not be called')
}).final(function (chain) {
    // done
}).start()
```

### .nextTo(branchName, data, ..., dataN)

**[API Reference](#api)**

Go to next branch.
```javascript
Chain(function (chain) {
    chain.nextTo('branchA')
}).then(function (chain) {
    throw new Error('This step should not be called')
}).branch('branchA', function (chain) {
    chain.next()
})
```
**Notice**: .nextTo() should not goto previous step
```javascript
Chain(function (chain) {
    chain.next()
}).branch('branchA', function (chain) {
    chain.next()
}).then(function (chain) {
    chain.nextTo('branchA') // will throw an error
}).start()
```

### .wait(time, data, ..., dataN)

**[API Reference](#api)**

Waiting some time then call next step.Just a shortcut of `setTimeout(function () {chain.next()}, time)`.
```javascript
// pass params to next step handler
chain.wait(5000, data); // wait 5s then call next
```

### .end(data, ..., dataN)

**[API Reference](#api)**

End up chain steps, mark the chain as ending, for cross steps data sharing
```javascript
chain.end();
// pass params to final handler
chain.end(data);
```

### .final(finalHandler)

**[API Reference](#api)**

Define a final step, witch will be invoke after call chain.end() or all step of this chain is over.
```javascript
Chain(function (chain) {
    ...
    chain.end('ending initial step')

}).then(function (chain) {

    ...
    chain.next('step 2 calling')

}).final(function (chain, data) {
    console.log(data) // --> ending initial step
})
```

### .data(savingData)

**[API Reference](#api)**

Saving data in current chain
```javascript
// set data
chain.data('param', param);
// set multiple data in batch
chain.data({
    'param1': param1,
    'param2': param2,
    'param3': param3
});
// get data
chain.data('param');
// get all data
var chainData = chain.data();
```

### .thunk(func)

**[API Reference](#api)**

Turn a regular node function into chainjs thunk.
```javascript
 function handler1 (param, callback) {
    callback(param + 'Chain through step1, ')
}
function handler2 (param, callback) {
    callback(param + 'step2')
}
Chain()
    .then(Chain.thunk(handler1))
    .then(Chain.thunk(handler2))
    .final(function (chain, data) {
        console.log(data); // --> Initialize! Chain through step1, step2
    })
    .start('Initialize! ')
```

### .context(ctx)

**[API Reference](#api)**

Binding "this" to specified ctx for all functions of each step of current chain. 
```js
Chain(function () {
    console.log(this); // --> "abc"
})
.then(function () {
    console.log(this); // --> "abc"
})
.context('abc')
.start()
```

## Run Testing
```bash
npm test
```

## Change Log

[See change logs](https://github.com/switer/chainjs/blob/master/CHANGELOG.md)

## License

The MIT License (MIT)

Copyright (c) 2013 `guankaishe`

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

