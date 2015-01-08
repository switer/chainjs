var Chain = require('../chain.js');

console.time('chain use time');

var chain = Chain(function (chain, msg) {
        console.log('Chain initialize');
        // save param
        chain.data('chain:param', msg);

        // console.log(msg); //Hello world
        chain.next({message: 'Next step'});
        
    });


for (var i = 0 ; i < 2000; i ++) {
    chain.then(function (chain, param) {
        // console.log(param.name);
        chain.next({name: 'switer'});
    });
}
chain.final(function () {
    console.timeEnd('chain use time');
})
chain.start();