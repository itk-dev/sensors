'use strict';

// This is only for testing purposes.
// Run this script from the commandline e.g. "node test_parser.js"
// to watch the data parsed and displayed as json.

const parser = require('./parser').elsysSensorParser();

let data = '0100e202290400270506060308070d62';
let buf = Buffer.from(data, 'hex');
let result = parser.parse(buf);

console.log(JSON.stringify(result, null, 2));
