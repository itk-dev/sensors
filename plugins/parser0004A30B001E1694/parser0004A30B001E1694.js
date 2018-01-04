/**
 * @file
 *
 * Sensor 0004A30B001E1694
 */

const Parser = require('binary-parser').Parser;

module.exports = function setup(options, imports, register) {
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

    let eventBus = imports.eventbus;

    eventBus.on('parse.0004A30B001E1694', function (data, returnEvent) {
        'use strict';

        let buf = new Buffer(data, 'hex');

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
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
