/**
 * @file
 *
 * Sensor A81758FFFE052540
 */

'use strict';

const ElsysDecoder = require('./elsys_decoder');

module.exports = function setup(options, imports, register) {
    const eventBus = imports.eventbus;
    const logger = imports.logger;

    const elsysParser = new ElsysDecoder.ElsysDecoder();

    /**
     * Adds sensors results to the map passed in the first parameter.
     * The result parameter must have a property named values which contains a list.
     *
     * @param result
     * @param sensorId
     * @param sensorType
     * @param sensorValue
     */
    const addValueToResult = function (result, sensorId, sensorType, sensorValue) {
        result[sensorType + '_sensor_id'] = sensorId;
        result[sensorType + '_value'] = sensorValue;
        result.values.push({
            sensor_id: sensorId,
            type: sensorType,
            value: sensorValue
        });
    };

    eventBus.on('parse.A81758FFFE052540', function (data, returnEvent) {
        /**
         * Its not totally clear what the data structure should be when pushing to open data.
         * For example is the sensor_id for the air_temperature always 74? Is the type always air_temperature?
         * Its relevant because different manufactured sensors use different id's and names for their sensor
         * values...
         */
        try {
            let result = elsysParser.decodeHex(data);
            result.values = [];

            addValueToResult(
                result,
                74,
                'air_temperature',
                result.temperature
            );

            addValueToResult(
                result,
                76,
                'humidity',
                result.humidity
            );

            addValueToResult(
                result,
                52,
                'battery',
                result.battery
            );

            addValueToResult(
                result,
                134,
                'water_temperature',
                result.externalTemperature
            );

            addValueToResult(
                result,
                77,
                'pressure',
                result.pressure
            );

            eventBus.emit(returnEvent, result);
        } catch (err) {
            logger.error('parserA81758FFFE052540 - Could not parse: ' + data);
            logger.error('parserA81758FFFE052540 - Error: ' + err);
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
