'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/results', (req, res) => {
    knex('sensor').orderBy('id', 'desc').limit(50).then(rows => {
        'use strict';
        res.send(JSON.stringify(rows));
    });
});

app.post('/', (req, res) => {
    let body = req.body;

    if (body.hasOwnProperty('EUI') && body.hasOwnProperty('data') && body.hasOwnProperty('seqno')) {
        // Avoid same sequence number.
        knex('sensor').select().orderBy('id', 'desc').limit(1).andWhere({sequence: body.seqno}).then(rows => {
            if (rows.length === 0) {
                knex('sensor').insert({
                    sensor: body.EUI,
                    sequence: body.seqno,
                    data: body.data,
                    sensor_ts: body.ts,
                    payload: JSON.stringify(body)
                }).then(
                    function() {},
                    function (err) {
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

app.listen(3000);
