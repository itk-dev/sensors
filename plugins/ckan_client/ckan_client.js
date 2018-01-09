/**
 * @file
 * OpenData module.
 */
'use strict';

const config = require('../../config');
const request = require('request');

module.exports = function setup (options, imports, register) {
    const eventBus = imports.eventbus;
    const logger = imports.logger;

    // Listen for sensor.new events.
    // Parse the new sensor package and save in influxdb.
    eventBus.on('sensor.new', (data) => {
        let now = new Date().getDate();
        let requestEvent = 'parse.' + data.EUI;
        let returnEvent = requestEvent + '-' + now;

        // Return event from sensor parser.
        eventBus.once(returnEvent, function (result) {
            let record = {
                time: new Date(data.ts).toISOString(),
                sensor: data.EUI
            };

            let records = [];

            for (let key in result.values) {
                let value = result.values[key];

                let newRecord = Object.assign({}, record);
                newRecord.value = value.value;
                newRecord.sensor_id = value.sensor_id;
                newRecord.type = value.type;

                records.push(newRecord);
            }

            request.post(
                {
                    url: 'https://test.opendata.dk/api/action/datastore_upsert',
                    json: {
                        resource_id: config.ckan.resource,
                        records: records,
                        method: 'upsert',
                        force: false
                    },
                    headers: {
                        'Authorization': config.ckan.apikey
                    }
                },
                function (error, response, body) {
                    if (!error && response.statusCode == 200 && body.success) {
                        logger.info('Pushed: ' + JSON.stringify(records) + ' to CKAN.');
                    }
                    else {
                        logger.error(JSON.stringify(body));
                    }
                }
            );
        });

        // Send event to get the parsed sensor data.
        eventBus.emit(requestEvent, data.data, returnEvent);
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
