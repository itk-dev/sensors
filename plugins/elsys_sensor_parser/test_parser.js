'use strict';

const parser = require('./parser').elsysSensorParser();

let data = '0100e202290400270506060308070d62';
let buf = Buffer.from(data, 'hex');
let result = parser.parse(buf);

console.log(JSON.stringify(result, null, 2));
