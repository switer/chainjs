var Chain = require('../chain');

function step2 (chain, param) {
    console.log('Chain step 2');
    console.log(param.name); // Next step
    chain.next({name: 'guankaishe'});
}

var step2Sham = Chain.sham(step2);

step2Sham({name: 'guanks'});

Chain(function (chain, msg) {
        console.log('Chain initialize');
        // save param
        chain.data('chain:param', msg);

        console.log(msg); //Hello world
        // setTimeout( function() {
            chain.next({message: 'Next step'});
        // }, 3000);
        
    }, 'Hello world')
    .then(function (chain, param) {
        console.log('Chain step 1');
        // chain.stop();
        chain.next({name: 'switer'});
        return;
        console.log(param.message); // log: Next step
    })
    .then(step2)
    .then(function (chain, param) {
        console.log('Chain step 3');

        console.log(param.name); // Next step
        chain.next({name: 'switer.github.io'});
    })
    .then(function (chain) {

        console.log('Chain step 4');
        chain.end();
    })
    .filter(function (filter, param) {
        console.log('filter 1', param);
        setTimeout( function() {
            filter.next({'abc':1123});
        }, 2000);
            
    })
    .filter(function (filter, param) {
        console.log('filter 2', param);
        // filter.chain.end();
        filter.next();
    })
    .before(function (chain, param) {
        console.log('1----In each chain-node before handlers');
        console.log('=======================================');
        if (param && param.name == 'guankaishe') {
            param.name = '';
            chain.next(param);
        }
    })
    .final(function (chain) {
        console.log('Chain step final');
    })
    .start(); // starting chain execute

