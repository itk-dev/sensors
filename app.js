'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
const Parser = require('binary-parser').Parser;

const parsers = {
    '0004A30B001E8EA2': new Parser()
        .endianess('big')
        .uint8('header_frame_counter')
        .uint8('header_frame_length')
        .uint8('sensor_batsensor_id')
        .uint8('sensor_bat_value')
        .uint8('sensor_charging_powersensor_id')
        .uint16('sensor_charging_power_value')
        .uint8('sensor_temperaturesensor_id')
        .floatle('sensor_temperature_value')
        .uint8('sensor_humiditysensor_id')
        .floatle('sensor_humidity_value')
        .uint8('sensor_pressuresensor_id')
        .floatle('sensor_pressure_value')
        .uint8('sensor_luxsensor_id')
        .uint32('sensor_lux_value')
        .uint8('sensor_solar_radiationsensor_id')
        .floatle('sensor_solar_radiation_value')
        .uint8('sensor_wind_speedsensor_id')
        .floatle('sensor_wind_speed_value')
        .uint8('sensor_wind_vanesensor_id')
        .uint8('sensor_wind_vane_value')
        .uint8('sensor_rainsensor_id')
        .floatle('sensor_rain_value')
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/results', (req, res) => {
    knex('sensor').orderBy('id', 'desc').limit(50).then(rows => {
        'use strict';
        res.send(JSON.stringify(rows));
    });
});

app.post('/', (req, res) => {
    let body = req.body;

    if (body.hasOwnProperty('EUI') && body.hasOwnProperty('gws') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno')) {
        // Avoid same sequence number.
        knex('sensor')
            .where({sensor: body.EUI, sequence: body.seqno, sensor_ts: body.ts})
            .then(rows => {
                if (rows.length === 0) {
                    knex('sensor').insert({
                        sensor: body.EUI,
                        sequence: body.seqno,
                        data: body.data,
                        sensor_ts: body.ts,
                        payload: JSON.stringify(body)
                    }).then(
                        function () {
                        },
                        function (err) {
                            console.log(err);
                            // @TODO: Log error.
                        }
                    );
                }
                else {
                    // @TODO: Log duplicate.
                }
            });
    }

    res.send('');
});

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
                var buf = new Buffer(data[0].data, 'hex');
                res.send(parsers[sensorId].parse(buf));
            }
        );
});

app.listen(3000);
