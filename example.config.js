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

config.influxdb = {
    host: 'localhost',
    database: 'sensor'
};

// @TODO
config.sensor_server_whitelist = [

];

config.sensor_whitelist = [
    '0004A30B001E8EA2',
    '0004A30B001E1694',
    '0004A30B001E307C'
];

config.logger = {
    level: 'info',
    console: false,
    files: {
        info: 'logs/info.log',
        error: 'logs/errors.log'
    }
};

config.port = 3000;

config.ckan = {
    packageId: '',
    tableName: '',
    apikey: '',
    url: '',
    resource: '',
    indexes: [
        'sensor', 'sensor_id', 'time', 'type'
    ],
    primaryKeys: [
        'sensor', 'sensor_id', 'time'
    ],
    schema: [
        {
            'id': 'sensor',
            'type': 'text'
        },
        {
            'id': 'sensor_id',
            'type': 'smallint'
        },
        {
            'id': 'type',
            'type': 'text'
        },
        {
            'id': 'time',
            'type': 'timestamp'
        },
        {
            'id': 'value',
            'type': 'float'
        }
    ]
};

module.exports = config;
