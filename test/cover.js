var chai = require('chai')

global.Chain = require('./tmp/chain.js')
global.assert = chai.assert
require('./spec.js')