var fs = require('fs'),
    cmd = fs.readFileSync('layout/cmd.js', 'utf-8'),
    browser = fs.readFileSync('layout/browser.js', 'utf-8'),
    chainjs = fs.readFileSync('chain.js', 'utf-8'),
    chainCmd = cmd.replace('@content', chainjs),
    chainBrowser = cmd.replace('@content', chainjs);

fs.writeFileSync('build/chain.cmd.js', chainCmd, 'utf-8');
fs.writeFileSync('build/chain.browser.js', chainBrowser, 'utf-8');
