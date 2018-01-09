/**
 * @file
 *
 * Sensor 0004A30B001E1694
 */
'use strict';

const Parser = require('binary-parser').Parser;

module.exports = function setup (options, imports, register) {
    const eventBus = imports.eventbus;
    const logger = imports.logger;

    const parser = new Parser()
        .endianess('big')
        .uint8('header_frame_counter')
        .uint8('header_frame_length')
        .uint8('battery_sensor_id')
        .uint8('battery_value')
        .uint8('charging_power_sensor_id')
        .uint16le('charging_power_value')
        .uint8('water_temperature_sensor_id')
        .floatle('water_temperature_value');

    eventBus.on('parse.0004A30B001E1694', function (data, returnEvent) {
        let buf = new Buffer(data, 'hex');

        try {
            let result = parser.parse(buf);

            let values = [];

            for (let key in result) {
                if (result.hasOwnProperty(key)) {
                    if (key.indexOf('_sensor_id') > -1) {
                        let split = key.split('_sensor_id');
                        let id = result[key];

                        let value = result[split[0] + '_value'];

                        values.push({
                            sensor_id: id,
                            type: split[0],
                            value: value
                        });
                    }
                }
            }

            result.values = values;

            eventBus.emit(returnEvent, result);
        }
        catch (err) {
            logger.error('parser0004A30B001E1694 - Could not parse: ' + data);

            eventBus.emit(returnEvent, {
                error: err
            });
        }
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
