'use strict';

const config = require('./../../config');

module.exports = function setup(options, imports, register) {
    let eventBus = imports.eventbus;
    let database = imports.database;
    let server = imports.server;

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

        if (body.hasOwnProperty('EUI') && config.sensor_whitelist.indexOf(body.EUI) === -1) {
            res.status(400).send();
            return;
        }

        // Demand that data.gws, data.data and data.seqno are set, before
        // adding to the sensor table.
        if (body.hasOwnProperty('gws') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno') && body.hasOwnProperty('ts')) {
            // Save to the database.
            database.addSensorPackage(body.EUI, body.seqno, body.ts, body.data, JSON.stringify(body));

            eventBus.emit('sensor.new', body);

            res.status(200).send();
        }
        else {
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

        database.getRecent(sensorId).then(
            (data) => {
                // Handle if item was found.
                if (data.length > 0) {
                    if (config.sensor_whitelist.indexOf(sensorId) === -1) {
                        res.status(404).send('Sensor not found');
                        return;
                    }

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
                    res.status(404).send('');
                }
            }
        );
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
