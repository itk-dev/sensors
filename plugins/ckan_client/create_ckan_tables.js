/**
 * @file
 * Script to create tables in CKAN.
 */
'use strict';

const config = require('../../config');
const request = require('request');

request.post(
    {
        url: config.ckan.url + '/api/action/datastore_create',
        json: {
            resource: {
                package_id: 'sensordata',
                name: config.ckan.tableName
            },
            primary_key: config.ckan.primaryKeys,
            fields: config.ckan.schema,
            'method': 'create',
            'force': false
        },
        headers: {
            'Authorization': config.ckan.apikey
        }
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
        else {
            console.error(error);
        }
    }
);
