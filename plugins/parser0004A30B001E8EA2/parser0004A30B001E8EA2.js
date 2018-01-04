/**
 * @file
 *
 * Sensor 0004A30B001E8EA2
 */
'use strict';

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
        .uint8('sensor_temperature_sensor_id')
        .floatle('sensor_temperature_value')
        .uint8('sensor_humidity_sensor_id')
        .floatle('sensor_humidity_value')
        .uint8('sensor_pressure_sensor_id')
        .floatle('sensor_pressure_value')
        .uint8('sensor_lux_sensor_id')
        .uint32le('sensor_lux_value')
        .uint8('sensor_solar_radiation_sensor_id')
        .floatle('sensor_solar_radiation_value')
        .uint8('sensor_wind_speed_sensor_id')
        .floatle('sensor_wind_speed_value')
        .uint8('sensor_wind_vane_sensor_id')
        .uint8('sensor_wind_vane_value')
        .uint8('sensor_rain_sensor_id')
        .floatle('sensor_rain_value');

    let eventBus = imports.eventbus;

    eventBus.on('parse.0004A30B001E8EA2', function (data, returnEvent) {
        let buf = new Buffer(data, 'hex');

        let result = parser.parse(buf);

        eventBus.emit(returnEvent, result);
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
