var fs = require('fs'),
    Chain = require('../chain'),
    cmd = fs.readFileSync('layout/cmd.js', 'utf-8'),
    browser = fs.readFileSync('layout/browser.js', 'utf-8'),
    chainjs = fs.readFileSync('chain.js', 'utf-8'),
    chainCmd = cmd.replace('@content', chainjs),
    chainBrowser = browser.replace('@content', chainjs);

fs.writeFileSync('build/chain.cmd.js', chainCmd, 'utf-8');
fs.writeFileSync('build/chain.browser.js', chainBrowser, 'utf-8');


Chain(function (chain) {
    fs.readFile('layout/cmd.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        chain.next(data);
    });
})
.then(function (chain, layout) {
    fs.writeFile('build/chain.cmd.js', layout, {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        chain.next();
    });
})
.then(function (chain) {
    fs.readFile('layout/cmd.js', {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        chain.next(data);
    });
})
.then(function (chain, layout) {
    fs.writeFile('build/chain.browser.js', layout, {encoding: 'utf-8'}, function (err, data) {
        if (err) {
            chain.end({
                error: err
            });
            return;
        }
        chain.next();
    });
})
.final(function (data) {
    if (data.error) {
        console.log()
    }
})
.start();