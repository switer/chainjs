chainjs
=======

Chaining of functions call to resolve the problem of javascript async callback handling.

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
    console.log(param.message); //Hello world
    chain.next('none');
}

function step1 (chain, data) {
    chain.next('say hello');
}

Chain(beginStep, param)
    .then(step1)
    .final(function (chain, data) {
        console.log(data); //say hello
    });
```

## API

### Chain(beginHandler)
```javascript
Chain(func, param)
```
### then(stepHandler)
```javascript
Chain(func).then(func1).then(func2)
```
### start()
```javascript
Chain(func).then(func1).then(func2).start();
```

### next(nextParams)
### end(finalParams)
### final(finalHandler)

### data(savingData)
Saving data in current chain
```javascript
Chain(function (chain, param) {
    chain.data('param', param);
    chain.next();
}, {data: ''})
    .then(function (chain) {
        var param = chain.data('param');

        console.log(param); // {data:''}
    })
    .start();
```
### filter(filterHandler)
TBD
### before(beforeHandler)

Will be invoked before each step
```javascript
Chain(function (chain, param) {
    chain.data('param', param);
    chain.next();
}, {data: ''})
    .then(function (chain) { // Step 1
        var param = chain.data('param');

        console.log(param); // {data:''}
    })
    .before(function (chain) { // Step before
        console.log('It will be invoked before each chain step')
    })
    .start();
```
### after(afterHandler)
TBD


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

MIT

