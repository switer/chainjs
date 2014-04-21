var Chain = require('../chain.js');

console.time('chain use time');

var chain = Chain(function (chain, msg) {
        console.log('Chain initialize');
        // save param
        chain.data('chain:param', msg);

        console.log(msg); //Hello world
        chain.next({message: 'Next step'});
        
    }, 'Hello world');


for (var i = 0 ; i < 2100; i ++) {
    // !function (index) {
        chain.then(function (chain, param) {
            // console.log('Chain step ' + index );
            chain.next({name: 'switer'});
            console.log('-----');
        });
    // }(i);
}
chain.final(function () {
    console.timeEnd('chain use time');
})
chain.start();