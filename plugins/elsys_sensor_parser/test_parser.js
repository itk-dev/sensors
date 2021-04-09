'use strict';

// This is only for testing purposes.
// Run this script from the commandline e.g. "node test_parser.js"
// to watch the data parsed and displayed as json.

const ElsysParser = require('./elsys_decoder');

let elsysParser = new ElsysParser.ElsysDecoder();

console.log(JSON.stringify(elsysParser.decodeHex('0100e202290400270506060308070d62'), null, 2));
console.log(JSON.stringify(elsysParser.decodeHex('0100f5021c0301023d070e1e0c00ee0f0014000f4229'), null, 2));
