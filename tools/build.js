var fs = require('fs'),
    colors = require('colors'),
    Chain = require('../chain'),
    step = 0;

Chain(function (chain) {
    fs.readFile('chain.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get chainjs content compelete!'.blue.grey);
        chain.data('content', data);
        chain.next();
    });
})
.then(function (chain, data) {
    fs.readFile('layout/cmd.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get chainjs cmd module layout compelete!'.blue.grey);
        chain.next(data);
    });
})
.then(function (chain, layout) {
    var content = chain.data('content');

    fs.writeFile('dist/chain.cmd.js', layout.replace('@content', content), {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Build chainjs cmd module success!'.green.grey);
        chain.next();
    });
})
.then(function (chain) {
    fs.readFile('layout/browser.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Get chainjs browser module layout compelete!'.blue.grey);
        chain.next(data);
    });
})
.then(function (chain, layout) {
    var content = chain.data('content');

    fs.writeFile('dist/chain.browser.js', layout.replace('@content', content), {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        console.log('Build chainjs browser module success!'.green.grey);
        chain.next();
    });
})
.final(function (chain, data) {
    if (data && data.error) {
        console.log(data.error);
    }
    console.log('Building compelete!');
})
.start();