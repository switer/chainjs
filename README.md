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

### Chain(beginHandler)
Instancing a chain and then likes call "then"
```javascript
Chain(func /*, func1, ..., funcN*/);
```

### .then(stepHandler /*, func1, ..., funcN*/)
Define chain steps, if a then step has multiple functions, step over after each func call chain.next()
```javascript
Chain(func).then(func1).then(funcA1, funcA2, funcA3)
```

### .some()
When call chain.next in which handler of "some" step will be over current step.
```javascript
Chain(func).then(func1).some(funcA1, funcA2, funcA3)
```

### .start()
Start running the chain
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
End up chain steps, mark the chain as ending
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

