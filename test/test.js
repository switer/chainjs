var Chain = require('../chain');

Chain(function (chain, param) {
        console.log('this is {}', this);
        console.log('Chain step 1');
        chain.wait(1000, {name: 'switer'});
    })
    .some(function (chain) {
        // console.log('Chain step 2-1');
        chain.wait(Math.round(Math.random()*5000), {name: 'Step 2-1'})
    }, function (chain) {
        // console.log('Chain step 2-2');
        chain.wait(Math.round(Math.random()*5000), {name: 'Step 2-2'})
    }, function (chain) {
        // console.log('Chain step 2-3');
        chain.wait(Math.round(Math.random()*5000), {name: 'Step 2-3'})
    })
    .then(function (chain, param) {
        console.log('Chain step 3');

        console.log('[In step 3] prev is : ', param.name); // Next step
        chain.next({name: 'switer.github.io'});
    })
    .then(function (chain) {
        console.log('Chain step 4-1');
        chain.next();
            
    }, function (chain) {
        setTimeout( function() {
            console.log('Chain step 4-2');
            chain.next();
        }, 2000);
            
    }, function (chain) {
        setTimeout( function() {
            console.log('Chain step 4-3');
            chain.next();
        }, 1000);
    })
    .final(function (chain) {
        console.log('Chain step final');
        chain.destroy();
    })
    .context({})
    .start(); // starting chain execute

