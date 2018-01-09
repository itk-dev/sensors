'use strict';

const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

module.exports = function setup (options, imports, register) {
    const logger = imports.logger;

    let database = {};

    /**
     * Get the latest 50 sensor packages.
     *
     * @return {Promise.<T>}
     */
    database.getRecentSensorPackages = () => {
        return knex('sensor').orderBy('id', 'desc').limit(50);
    };

    /**
     * Get the most recent sensor package with sensorId.
     *
     * @param sensorId The id of the sensor.
     *
     * @return {Promise.<T>}
     */
    database.getRecent = (sensorId) => {
        return knex('sensor')
            .where({sensor: sensorId})
            .orderBy('id', 'desc')
            .limit(1)
            .catch((err) => {
                logger.error(err);
            });
    };

    /**
     * Get sensor package based on sensor, sequence and sensor_ts.
     *
     * @param sensor The sensor id.
     * @param sequence The sequence number.
     * @param sensor_ts The sensor timestamp.
     *
     * @return {Promise.<T>}
     */
    database.getSensorPackage = (sensor, sequence, sensor_ts) => {
        return knex('sensor')
            .where({sensor: sensor, sequence: sequence, sensor_ts: sensor_ts})
            .catch((err) => {
                logger.error(err);
            });
    };

    /**
     * Add a new sensor package.
     *
     * @param sensor The sensor id.
     * @param sequence The sequence number.
     * @param sensor_ts The sensor timestamp.
     * @param data The sensor data.
     * @param payload The complete payload.
     */
    database.addSensorPackage = (sensor, sequence, sensor_ts, data, payload) => {
        knex('sensor').insert({
            sensor: sensor,
            sequence: sequence,
            data: data,
            sensor_ts: sensor_ts,
            payload: payload
        }).then(
            () => {
                logger.info(sensor + ' - ' + data + ' added.');
            }
        ).catch((err) => {
            logger.error(err);
        });
    };

    /**
     * Register with architect.
     */
    register(null, {
        database: database
    });
};
