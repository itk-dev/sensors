/**
 * @file
 * Api module. Provides API for sensor packages.
 */
'use strict';

const config = require('./../../config');
const Influx = require('influx');

module.exports = function setup (options, imports, register) {
  const eventBus = imports.eventbus;
  const server = imports.server;
  const logger = imports.logger;
  const influxdb = imports.influxdb;

  /**
   * GET: /api/sensordata/citylab
   */
  server.get('/api/sensordata/citylab', (req, res) => {
    let queries = [];

    for (let sensorParameter of req.query.sensor) {
      let sensorPair = sensorParameter.split(',');

      let type = Influx.escape.measurement(sensorPair[1]);
      let sensor = Influx.escape.tag(sensorPair[0]);

      let query = `select value from "${type}" where sensor = "${sensor}" order by time desc limit 1`;

      queries.push(query);
    }

    influxdb.query(queries).then(result => {


      res.json(result);
    }).catch(err => {
      console.log(err);
      res.status(500).send(err.stack);
    });
  });

  /**
   * Register with architect.
   */
  register(null, {});
};
