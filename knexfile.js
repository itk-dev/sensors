/**
 * Configuration file for knex - http://knexjs.org/.
 */

'use strict';

const config = require('./config');

module.exports = {
    development: {
        client: config.database_client,
        connection: config.database_connection,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
