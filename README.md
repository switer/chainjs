chainjs
=======

Chained async steps calling.Compare to Promise is more simple and clear. I has use it in node.js backend and browser
client case.

## Install

```bash
npm install chainjs
```

## Usage

__use in node:__
```javascript
var Chain = require('chainjs')

function beginStep (chain) {
    console.log('initialize');
    chain.next('none');
}

function step1 (chain, data) {
    console.log(data); // --> none
    chain.next('say hello');
}

Chain(beginStep)
    .then(step1)
    .final(function (chain) {
        console.log(data); // --> say hello
    });
```

![diagram](http://switer.qiniudn.com/chainjs-diagram.png)

## API
Each step's handler has been passed the `chain` instance as the first argument

### Chain(func, func1, ..., funcN)
Instancing a chain and define a chain step
```javascript
Chain(func /*, func1, ..., funcN*/);
```

### .then(func, func1, ..., funcN)
Define chain steps, if a then step has multiple functions, step over after each func call chain.next()
```javascript
Chain(func).then(func1).then(funcA1, funcA2, funcA3)
```

### .retry()
Call current step handler once again (recursive).
```javascript
var flag
Chain(function (chain, data) {
    if (flag) {
        return chain.next()
    }
    flag = true
}).start('value')
```

### .some(func, func1, ..., funcN)
When call chain.next in which handler of "some" step will be over current step.
```javascript
Chain(func).then(func1).some(funcA1, funcA2, funcA3)
```

### .start(data)
Start running the chain, and could pass data to initial step.
```javascript
Chain(func).then(func1).then(func2).start();
```

### .destroy()
Destroy the chain, mark the chain as ending and destroy local variable, but not call ending funtions
__notice:__after use chain.destroy(), the chain contiue execute current step handler, 
so use with return for stoping current step excution
```javascript
Chain(func).then(function (chain) {
    chain.destroy();
    return;
}).start();
```

### .next(nextParams)
Go to next step
```javascript
chain.next();
// pass params to next step handler
chain.next(data);
```

### .wait(time, nextParams)
Waiting some time then call next step
```javascript
// pass params to next step handler
chain.wait(5000, data); // wait 5s then call next
```

### .end(finalParams)
End up chain steps, mark the chain as ending, for cross steps data sharing
```javascript
chain.end();
// pass params to final handler
chain.end(data);
```

### .final(finalHandler)
Pushing final handler which will be invoke when chain.end() or chain step is ending

### .data(savingData)
Saving data in current chain
```javascript
// set data
chain.data('param', param);
// get data
chain.data('param');
// get all data
var chainData = chain.data();
```

## Testing
Chainjs using [mocha](http://mochajs.org/) for BBD test, run below cli to run testing in nodejs
```bash
npm test
```

## Example

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

