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

### Chain()
```javascript
Chain(func, param)
```
### then()
```javascript
Chain(func).then(func1).then(func2)
```
### start()
```javascript
Chain(func).then(func1).then(func2).start();
```

### next()
### end()
### final()

### data()
Saving data in current chain
```javascript
Chain(function (chain, param) {
    chain.data('param', param);
}, {data: ''})
    .then(function (chain) {
        var param = chain.data('param');

        console.log(param); // {data:''}
    })
    .start();
```
### filter()
TBD
### before()
TBD
### after()
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

## License

MIT

