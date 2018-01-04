'use strict';

const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

module.exports = function setup (options, imports, register) {
    let database = {};

    database.getSensorPackage = () => {

    };

    database.getRecentSensorPackages = () => {
        return knex('sensor').orderBy('id', 'desc').limit(50);
    };

    database.getRecent = (sensorId) => {
        return knex('sensor')
            .where({sensor: sensorId})
            .orderBy('id', 'desc')
            .limit(1);
    };

    database.addSensorPackage = (sensor, sequence, sensor_ts, data, payload) => {
        knex('sensor')
            .where({sensor: sensor, sequence: sequence, sensor_ts: sensor_ts})
            .then((rows) => {
                // Avoid duplicate entry.
                if (rows.length === 0) {
                    knex('sensor').insert({
                        sensor: sensor,
                        sequence: sequence,
                        data: data,
                        sensor_ts: sensor_ts,
                        payload: payload
                    });
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };

    /**
     * Register with architect.
     */
    register(null, {
        database: database
    });
};
