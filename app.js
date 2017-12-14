const express = require('express');
const app = express();
const mariadb = require('mariasql');
const config = require('./config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    let c = new mariadb(config.mariadb);

    c.query('SELECT * FROM sensor ORDER BY id DESC limit 50',
        function (err, rows) {
            if (err) {
                throw err;
            }

            let result = '<style>td { border: 1px solid black; margin: 0}</style><h1>Sensor data</h1><table>';

            for (let row of rows) {
                result += '<tr>';
                result += '<td>' + row.id + '</td>';
                result += '<td>' + row.sensor + '</td>';
                result += '<td>' + row.sequence + '</td>';
                result += '<td>' + row.timestamp + '</td>';
                result += '<td>' + row.data + '</td>';
                result += '</tr>';
            }

            res.send(result);
        });

    c.end();
});

app.post('/', (req, res) => {
    let c = new mariadb(config.mariadb);
    let insertQuery = c.prepare('INSERT INTO sensor (sensor, sequence, data) VALUES (:sensor, :sequence, :data)');

    let body = req.body;

    if (body.hasOwnProperty('EUI') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno')) {
        c.query(insertQuery({
            sensor: body.EUI,
            sequence: body.seqno,
            data: body.data
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
