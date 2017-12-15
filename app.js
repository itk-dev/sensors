const express = require('express');
const app = express();
const mariadb = require('mariasql');
const config = require('./config');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/results', (req, res) => {
    let c = new mariadb(config.mariadb);

    let result = [];

    c.query('SELECT * FROM sensor ORDER BY id DESC limit 50',
        function (err, rows) {
            if (err) {
                throw err;
            }

            result = rows;

            res.send(JSON.stringify(result));
        });

    c.end();
});

app.post('/', (req, res) => {
    let c = new mariadb(config.mariadb);
    let insertQuery = c.prepare('INSERT INTO sensor (sensor, sequence, data, sensor_ts) VALUES (:sensor, :sequence, :data, :sensor_td)');

    let body = req.body;

    if (body.hasOwnProperty('EUI') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno')) {
        c.query(insertQuery({
            sensor: body.EUI,
            sequence: body.seqno,
            data: body.data,
            sensor_td: body.ts
        }), function (err) {
            if (err) {
                throw err;
            }
        });
    }

    c.end();

    res.send('');
});

app.listen(3000);
