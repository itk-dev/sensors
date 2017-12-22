/**
 * @file
 * Main app that sets up api and homepage.
 */

'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
const Parser = require('binary-parser').Parser;
const config = require('./config');

// Setup parsers.
const parsers = {
    '0004A30B001E8EA2': new Parser()
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
        .floatle('sensor_rain_value'),
    '0004A30B001E1694': new Parser()
        .endianess('big')
        .uint8('header_frame_counter')
        .uint8('header_frame_length')
        .uint8('sensor_bat_sensor_id')
        .uint8('sensor_bat_value')
        .uint8('sensor_charging_power_sensor_id')
        .uint16le('sensor_charging_power_value')
        .uint8('sensor_water_temperature_sensor_id')
        .floatle('sensor_water_temperature_value'),
    '0004A30B001E307C': new Parser()
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
        .uint8('sensor_distance_to_water_sensor_id')
        .uint16le('sensor_distance_to_water_value')
};

// Parse json and urlencoded bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 * GET: /
 *
 * Serves the homepage.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

/**
 * GET: /api/results
 *
 * Get the latest 50 data packages.
 */
app.get('/api/results', (req, res) => {
    knex('sensor').orderBy('id', 'desc').limit(50).then(rows => {
        'use strict';
        res.send(JSON.stringify(rows));
    });
});

/**
 * POST: /
 *
 * Add a data package to the service.
 */
app.post('/', (req, res) => {
    let body = req.body;

    // Demand that data.EUI, data.gws, data.data and data.seqno are set, before
    // adding to the sensor table.
    if (body.hasOwnProperty('EUI') && body.hasOwnProperty('gws') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno')) {
        // Avoid same sequence number.
        knex('sensor')
            .where({sensor: body.EUI, sequence: body.seqno, sensor_ts: body.ts})
            .then(rows => {
                // Avoid duplicate entry.
                if (rows.length === 0) {
                    knex('sensor').insert({
                        sensor: body.EUI,
                        sequence: body.seqno,
                        data: body.data,
                        sensor_ts: body.ts,
                        payload: JSON.stringify(body)
                    });
                }
            });
    }
    res.send('');
});

/**
 * GET: /api/recent?sensor=ID
 *
 * Get the most recent result for the sensor with ID.
 */
app.get('/api/recent', (req, res) => {
    let sensorId = req.query.sensor;

    if (!sensorId) {
        let msg = {
            message: 'No sensor set'
        };
        res.status(404).send(JSON.stringify(msg));
        return;
    }

    knex('sensor')
        .where({sensor: sensorId})
        .orderBy('id', 'desc')
        .limit(1)
        .then(
            (data) => {
                // Handle if item was found.
                if (data.length > 0) {
                    let buf = new Buffer(data[0].data, 'hex');

                    let result = parsers[sensorId].parse(buf);

                    result.sensor_ts = data[0].sensor_ts;
                    result.sensor = data[0].sensor;
                    res.send(result);
                }
                else {
                    res.status(404).send('');
                }
            }
        );
});

/**
 * Start listening to port.
 */
app.listen(config.port);
