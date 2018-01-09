/**
 * @file
 * OpenData module.
 */
'use strict';

const config = require('../../config');
const request = require('request');

module.exports = function setup (options, imports, register) {
    let eventBus = imports.eventbus;

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
                let value = data.values[key];

                let newRecord = Object.assign({}, record);
                newRecord.val = value.value;
                newRecord.sensor_id = value.sensor_id;
                newRecord.type = value.type;

                records.push(newRecord);
            }

            request.post(
                {
                    url: 'https://test.opendata.dk/api/action/datastore_upsert',
                    json: {
                        resource_id: config.opendata.resources[0].resource,
                        records: [
                            record
                        ], 'method': 'upsert', 'force': false
                    },
                    headers: {
                        'Authorization': config.opendata.apikey
                    }
                },
                function (error, response, body) {
                    console.log(body);

                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    }
                    else {
                        console.error(error);
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
