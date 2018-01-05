/**
 * @file
 * Api module. Provides API for sensor packages.
 */
'use strict';

const config = require('./../../config');

module.exports = function setup(options, imports, register) {
    const eventBus = imports.eventbus;
    const database = imports.database;
    const server = imports.server;
    const logger = imports.logger;

    server.get('/api/sensorpackage', (req, res) => {
        res.status(500).send();
    });

    /**
     * GET: /api/sensorpackage/recent
     *
     * Get the latest 50 sensor packages.
     */
    server.get('/api/sensorpackage/recent', (req, res) => {
        database.getRecentSensorPackages().then(
            (data) => {
                res.send(JSON.stringify(data));
            }
        );
    });

    /**
     * POST: /
     *
     * Add a data package to the service.
     */
    server.post('/', (req, res) => {
        let body = req.body;

        // Demand that data.gws, data.data and data.seqno are set, before
        // adding to the sensor table.
        if (body.hasOwnProperty('EUI') && body.hasOwnProperty('gws') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno') && body.hasOwnProperty('ts')) {
            // Check if the sensor is allowed access.
            if (body.hasOwnProperty('EUI') && config.sensor_whitelist.indexOf(body.EUI) === -1) {
                logger.warn('Sensor not whitelisted or has no EUI');
                res.status(400).send();
                return;
            }

            // Check that the sensor package has not already been added.
            database.getSensorPackage(body.EUI, body.seqno, body.ts).then((rows) => {
                // Avoid duplicate entry.
                if (rows.length === 0) {
                    // Save to the database.
                    database.addSensorPackage(body.EUI, body.seqno, body.ts, body.data, JSON.stringify(body));
                }

                // Emit event that new sensor package has been added.
                eventBus.emit('sensor.new', body);
            });

            res.status(201).send();
        }
        else {
            logger.warn('Package does not have required fields: EUI, gws, data, seqno, ts');
            res.status(400).send();
        }
    });

    /**
     * GET: /api/recent?sensor=ID
     *
     * Get the most recent result for the sensor with ID.
     */
    server.get('/api/recent', (req, res) => {
        let sensorId = req.query.sensor;

        if (!sensorId) {
            let msg = {
                message: 'No sensor set'
            };
            res.status(404).send(JSON.stringify(msg));
            return;
        }

        if (config.sensor_whitelist.indexOf(sensorId) === -1) {
            res.status(400).send('Sensor not allowed');
            return;
        }

        database.getRecent(sensorId).then(
            (data) => {
                // Handle if item was found.
                if (data.length > 0) {
                    let now = new Date().getDate();
                    let requestEvent = 'parse.' + sensorId;
                    let returnEvent = requestEvent + '-' + now;

                    eventBus.once(returnEvent, function (result) {
                        result.sensor_ts = data[0].sensor_ts;
                        result.sensor = data[0].sensor;
                        res.send(result);
                    });

                    eventBus.emit(requestEvent, data[0].data, returnEvent);
                }
                else {
                    res.status(404).send();
                }
            }
        );
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
