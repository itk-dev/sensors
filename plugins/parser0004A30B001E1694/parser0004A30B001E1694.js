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
        .uint8('sensor_bat_sensor_id')
        .uint8('sensor_bat_value')
        .uint8('sensor_charging_power_sensor_id')
        .uint16le('sensor_charging_power_value')
        .uint8('sensor_water_temperature_sensor_id')
        .floatle('sensor_water_temperature_value');

    let eventBus = imports.eventbus;

    eventBus.on('parse.0004A30B001E1694', function (data, returnEvent) {
        'use strict';

        let buf = new Buffer(data, 'hex');

        let result = parser.parse(buf);

        eventBus.emit(returnEvent, result);
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
