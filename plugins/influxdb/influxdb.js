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

    eventBus.on('sensor.new', (data) => {
        let now = new Date().getDate();
        let requestEvent = 'parse.' + data.EUI;
        let returnEvent = requestEvent + '-' + now;

        eventBus.once(returnEvent, function (result) {
            let dataPoints = [];

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

            influx.writePoints(dataPoints)
                .catch(err => {
                    console.error(`Error saving data to InfluxDB! ${err.stack}`);
                });
        });

        eventBus.emit(requestEvent, data.data, returnEvent);
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
