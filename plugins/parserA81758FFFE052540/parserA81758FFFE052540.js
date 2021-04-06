/**
 * @file
 *
 * Sensor A81758FFFE052540
 */
'use strict';

module.exports = function setup(options, imports, register) {
    const eventBus = imports.eventbus;
    const logger = imports.logger;
    const parser = imports.elsysSensorParser;

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
            let buf = Buffer.from(data.toString(), 'hex');
            let result = parser.parse(buf);

            let formattedResult = {};
            formattedResult['values'] = [];

            for (let key in result.data) {
                let sensorResult = result.data[key];

                switch (sensorResult.type) {
                    case 1:
                        addValueToResult(
                            formattedResult,
                            74,
                            'air_temperature',
                            sensorResult.data.temperature
                        );
                        break;
                    case 2:
                        addValueToResult(
                            formattedResult,
                            76,
                            'humidity',
                            sensorResult.data.humidity
                        );
                        break;
                    case 7:
                        addValueToResult(
                            formattedResult,
                            52,
                            'battery',
                            sensorResult.data.battery
                        );
                        break;
                    case 12:
                        addValueToResult(
                            formattedResult,
                            134,
                            'water_temperature',
                            sensorResult.data.external_temperature
                        );
                        break;
                    case 20:
                        addValueToResult(
                            formattedResult,
                            77,
                            'pressure',
                            sensorResult.data.pressure
                        );
                        break;
                }
            }

            eventBus.emit(returnEvent, formattedResult);
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
