var Chain = require('../chain');

Chain(function (chain, msg) {
        console.log('Chain initialize');
        // save param
        chain.data('chain:param', msg);

        console.log(msg); //Hello world
        chain.next({message: 'Next step'});

    }, 'Hello world')
    .then(function (chain, param) {
        console.log('Chain step 1');

        console.log(param.message); // Next step
        chain.next({name: 'switer'});
    })
    .then(function (chain, param) {
        console.log('Chain step 2');

        console.log(param.name); // Next step
        chain.next({name: 'guankaishe'});
    })
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
        // the param will be no to next filter
        filter.next({'abc':1123});
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