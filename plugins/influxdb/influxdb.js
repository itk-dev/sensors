/**
 * @file
 * Contains listener for submitting data into influxdb.
 */
'use strict';

const Influx = require('influx');
const config = require('./../../config');

module.exports = function setup (options, imports, register) {
    const eventBus = imports.eventbus;
    const influx = new Influx.InfluxDB(config.influxdb);

    // Listen for sensor.new events.
    // Parse the new sensor package and save in influxdb.
    eventBus.on('sensor.new', (data) => {
        let now = new Date().getDate();
        let requestEvent = 'parse.' + data.EUI;
        let returnEvent = requestEvent + '-' + now;

        // Return event from sensor parser.
        eventBus.once(returnEvent, function (result) {
            let dataPoints = [];

            // Convert data values to data points.
            for (let key in result.values) {
                if (result.values.hasOwnProperty(key)) {
                    let obj = result.values[key];

                    dataPoints.push({
                        measurement: obj.type,
                        tags: {sensor: data.EUI, sensor_id: obj.sensor_id},
                        fields: {value: obj.value},
                        timestamp: new Date(data.ts)
                    });
                }
            }

            // Save data in influxdb.
            influx.writePoints(dataPoints)
                .catch(err => {
                    console.error(`Error saving data to InfluxDB! ${err.stack}`);
                });
        });

        // Send event to get the parsed sensor data.
        eventBus.emit(requestEvent, data.data, returnEvent);
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
