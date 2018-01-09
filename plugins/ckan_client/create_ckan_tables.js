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
                package_id: config.ckan.packageId,
                name: config.ckan.tableName
            },
            primary_key: config.ckan.primaryKeys,
            indexes: config.ckan.indexes,
            fields: config.ckan.schema,
            'method': 'create',
            'force': false
        },
        headers: {
            'Authorization': config.ckan.apikey
        }
    },
    function (error, response, body) {
        console.log(body);
    }
);
