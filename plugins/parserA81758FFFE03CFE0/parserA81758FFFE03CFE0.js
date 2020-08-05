/**
 * @file
 *
 * Sensor A81758FFFE03CFE0
 */
'use strict';

module.exports = function setup(options, imports, register) {
    const eventBus = imports.eventbus;
    const logger = imports.logger;
    const parser = imports.elsysSensorParser;

    eventBus.on('parse.A81758FFFE03CFE0', function (data, returnEvent) {

        /**
         * Its not totally clear what the data structure should be when pushing to open data.
         * For example is the sensor_id for the air_temperature always 74? Is the type always air_temperature?
         * Its relevant because different manufactured sensors use different id's and names for their sensor
         * values...
         */
        try {
            let result = parser.parse(data);

            let values = [];

            for (let sensorResult in result.data) {

                switch (sensorResult.type) {

                    case 1:
                        values.push({
                            sensor_id: 74,
                            type: 'air_temperature',
                            value: sensorResult.data.temperature
                        });
                        break;

                    case 2:
                        values.push({
                            sensor_id: 76,
                            type: 'humidity',
                            value: sensorResult.data.humidity
                        });
                        break;

                    case 7:
                        values.push({
                            sensor_id: 52,
                            type: 'battery',
                            value: sensorResult.data.battery
                        });
                        break;

                    case 20:
                        values.push({
                            sensor_id: 77,
                            type: 'pressure',
                            value: sensorResult.data.pressure
                        });
                        break;

                }
            }

            result.values = values;

            eventBus.emit(returnEvent, result);

        } catch (err) {
            logger.error('parserA81758FFFE03CFE0 - Could not parse: ' + data);

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
