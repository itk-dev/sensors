const express = require('express');
const app = express();
const mariadb = require('mariasql');
const config = require('./config');
const bodyParser = require('body-parser');

app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', (req, res) => {
  let c = new mariadb(config.mariadb);

  c.query('SELECT * FROM sensor',
    function(err, rows) {
      if (err)
        throw err;

      console.dir(rows);
    });


  c.end();

  res.send('Hello World!')
});

app.post('/', (req, res) => {
  let c = new mariadb(config.mariadb);

  let body = req.body;

  if (body.hasOwnProperty('sensor') && body.hasOwnProperty('data') && body.hasOwnProperty('sequence')) {
    c.query('INSERT INTO sensor (sensor, sequence, data) VALUES ("' + body.sensor + '", ' + body.sequence + ', "' + body.data + '")',
      function(err, rows) {
        if (err)
          throw err;
      });
  }

  c.end();

  res.send('')
});

app.listen(3000, () => console.log('Sensor listening on port 3000!'));
