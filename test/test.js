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
        chain.end({name: 'switer.github.io'});
    })
    .then(function (chain) {
        //will be skiped
        console.log('Chain step 3');
    })
    .before(function (chain) {
        console.log('1----In each chain-node before handlers');
        console.log('=======================================');
    })
    .before(function (chain) {
        console.log('2----In each chain-node before handlers');
        console.log('=======================================');
    })
    .final(function (chain, author) {
        console.log('Chain step final');
        
        var param = chain.data('chain:param');

        console.log(param); // Hello world
        console.log(author.name); // switer

    })
    .start(); // starting chain execute