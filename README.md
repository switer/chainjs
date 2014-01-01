chainjs
=======

Chainjs call each async function step by step, let async function callback fairily.

## Install

```bash
npm install chainjs
```

## Usage

__use in node:__
```javascript
var Chain = require('chainjs'),
    param = {message: 'Hello world';}

function beginStep (chain, param) {
    console.log(param.message); // --> Hello world
    chain.next('none');
}

function step1 (chain, data) {
    chain.next('say hello');
}

Chain(beginStep, param)
    .then(step1)
    .final(function (chain, data) {
        console.log(data); // --> say hello
    });
```

## API

### Chain(beginHandler)
Instancing a chain and push a start handler with param which will be invoke when chain.start() 
```javascript
Chain(func, param);
```
### Chain.sham(beginHandler)
chain sham, use for calling chain step handler as normal function 
```javascript
function step (chain, param) {
    console.log(param.name);
    chain.next();
}
var stepSham = Chain.sham(step);
stepSham({name: "switer"}); // --> switer
```

### .then(stepHandler)
Push a chain step handler
```javascript
Chain(func).then(func1).then(func2)
```

### .start()
Start the chain and invoke start handler
```javascript
Chain(func).then(func1).then(func2).start();
```

### .stop()
Stop the chain, mark the chain as ending and destroy local variable
__notice:__after use chain.stop(), the chain contiue execute current step handler, 
so use with return for stoping current step excution
```javascript
Chain(func).then(function (chain) {
    chain.stop();
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

### .end(finalParams)
End up current step
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

### .before(beforeHandler)
Will be invoked before each step in sync
```javascript
Chain(function (chain) {chain.next();})
    .then(function (chain) { //  --> Step 1
        var param = chain.data('param');

        console.log(param); //  --> {data:''}
    })
    .before(function (chain) { // Step before
        console.log('It will be invoked before each chain step')
    })
    .start();
```

### .filter(filterHandler)
Invoked before `before` and `step` handler, it run before each chain step, you should use filter.next() 
continue execute next filter or execute current step handler. If use filter.chain in filter, 
the chain will skip current step handler and go to next step handler
```javascript
Chain(func, param)
    .then(func)
    .filter(function (filter) {
        console.log('run filter');
        setTimeout( function() {
            filter.next();
        });
    });
```

## Testing

```bash
npm test
```

## Example

```javascript
var Chain = require('chainjs');

Chain(function (chain, msg) {
        // save param
        chain.data('chain:param', msg);

        console.log(msg); //Hello world
        chain.next({message: 'Next step'});

    }, 'Hello world')
    .then(function (chain, param) {

        console.log(param.message); // Next step
        chain.end({name: 'switer'})
    })
    .then(function (chain) {
        //will be skiped
    })
    .final(function (chain, author) {
        var param = chain.data('chain:param');

        console.log(param); // Hello world
        console.log(author.name); // switer

    })
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

