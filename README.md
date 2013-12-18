chainjs
=======

Chaining of functions call to resolve the problem of javascript async callback handle

## Install

```bash
npm install chainjs
```

## Usage

__use in node:__
```javascript

var Chain = require('chainjs');

var param = {
    message: 'Hello world';
}

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

## Example


