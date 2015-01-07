chainjs
=======
![logo](http://switer.qiniudn.com/chain.png)

An asynchronous callback's flow controller, chaining async function callbacks. Async methods calling flow make easy. I use it in node.js server and webapp.

## Install

```bash
npm install chainjs
```

## Usage

__use in node:__
```javascript
var Chain = require('chainjs')

Chain(function (chain) {
        console.log('initialize');
        chain.next('none');
    })
    .some(function (chain) {
        chain.wait(300, 'then go to next in step 1')
    }, function (chain) {
        chain.wait(200, 'then go to next in step 2')
    }, function (chain) {
        chain.wait(100, 'then go to next in step 3')
    })
    .then(function (chain, data) {
        console.log(data); // --> then go to next in step 3
        chain.next('say hello');
    })
    .final(function (chain, data) {
        console.log(data); // --> say hello
    });
```

![diagram](http://switer.qiniudn.com/chainjs2.png)

## API
Each step's handler has been passed the `chain` instance as the first argument

### Chain(func, func1, ..., funcN)
Instancing a chain, if arguments is not empty, it will be call .then() with arguments automatically.
If first argument is type of `Array`, that argument will be passed as arguments.
```javascript
Chain(func /*, func1, ..., funcN*/);
// or 
Chain([func, func1, funcN])
```

### .then(func, func1, ..., funcN)
Define a chain step, if a then step has multiple functions, it need each function call chain.next() to goto next step.
```javascript
Chain().then(funcA1, funcA2, funcA3).then(func1)
```
If first argument is type of `Array`, that argument will be passed as arguments.
```javascript
Chain.then([func1, func2, ..., funcN])
// equal to 
Chain.then(func1, func2, ..., funcN)
```


### .retry()
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

### .some(func, func1, ..., funcN)
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

### .each(func, func1, ..., funcN)
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

### .start(data, data1, ..., dataN)
Start running the chain, and could pass data to initial step.
```javascript
Chain(function (chain, initData) {
    
}).then(func1).then(func2).start(initData);
```

### .destroy()
Destroy the chain, mark the chain as ending and destroy local variable, but don't calling final funtions.

__notice:__ after use chain.destroy(), the chain contiue execute current step handler, 
so use with return for stoping current step excution
```javascript
Chain(func).then(function (chain) {
    chain.destroy();
    return;
}).start();
```

### .next(data, data1, ..., dataN)
Go to next step
```javascript
chain.next();
// pass params to next step handler
chain.next(data);
```

### .branch(branchName, func)
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

### .nextTo(branchName, data, data1, ..., dataN)
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

### .wait(time, data, data1, ..., dataN)
Waiting some time then call next step.Just a shortcut of `setTimeout(function () {chain.next()}, time)`.
```javascript
// pass params to next step handler
chain.wait(5000, data); // wait 5s then call next
```

### .end(data, data1, ..., dataN)
End up chain steps, mark the chain as ending, for cross steps data sharing
```javascript
chain.end();
// pass params to final handler
chain.end(data);
```

### .final(finalHandler)
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

## Testing
Chainjs using [mocha](http://mochajs.org/) for BDD test, run below cli to run testing in nodejs
```bash
npm test
```

## Example
See [using chainjs control business logic flow example](https://github.com/switer/chainjs-flow-control-demo)

```javascript
var Chain = require('chainjs');
var someStepCount = 0;
var parallelCount = 0;

Chain(function (chain) {
        // save param
        chain.data('chain:param', 'Chain initial step data');
        chain.next({message: 'Next step'});
    })
    .some(function (chain, param) {
        someStepCount ++;
        chain.wait(2000, 'step is "some-1"');
    }, function (chain, param) {
        someStepCount ++;
        chain.wait(1000, 'step is "some-2"');
    })
    .then(function (chain, msg) {
        console.log(msg); // step is "some-2
        // Step over when last step has one hander called
        console.log(someStepCount); // 1
        chain.next();
    })
    .then(function (chain) {
        parallelCount ++;
        chain.next();
    }, function (chain) {
        parallelCount ++;
        chain.next();
    }, function (chain) {
        parallelCount ++;
        chain.next();
    })
    .then(function (chain) {
        // all handlers had been called in last step
        console.log(parallelCount); // 3
        chain.end();
    })
    .then(function (chain) {
        //prev step had call chain.end(), so this step will be skiped
    })
    .final(function (chain) {
        var param = chain.data('chain:param');
        console.log(param); // "Chain initial step data"
    })
    .context(this)
    .start(); // starting chain execute
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

