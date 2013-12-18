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
        chain.end({name: 'switer'})
    })
    .then(function (chain) {
        console.log('Chain step 2');
        //will be skiped
    })
    .final(function (chain, author) {
        console.log('Chain step final');
        
        var param = chain.data('chain:param');

        console.log(param); // Hello world
        console.log(author.name); // switer

    })
    .start(); // starting chain execute