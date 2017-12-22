/**
 * @file
 * Example configuration file.
 *
 * Copy this to config.js and adjust the values to your setup.
 */

'use strict';

let config = {};

config.database_client = 'mariasql';

config.database_connection = {
    host : '127.0.0.1',
    db: 'db',
    user: 'root',
    password: 'vagrant'
};

config.port = 3000;

module.exports = config;
