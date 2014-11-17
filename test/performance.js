var Chain = require('../chain.js');

console.time('chain use time');

var chain = Chain(function (chain, msg) {
        console.log('Chain initialize');
        // save param
        chain.data('chain:param', msg);

        console.log(msg); //Hello world
        chain.next({message: 'Next step'});
        
    });


for (var i = 0 ; i < 1200; i ++) {
    // !function (index) {
        chain.then(function (chain, param) {
            // console.log('Chain step ' + index );
            console.log(param.name);
            chain.next({name: 'switer'});
        });
    // }(i);
}
chain.final(function () {
    console.timeEnd('chain use time');
})
chain.start();