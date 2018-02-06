/**
 * @file
 * Api module. Provides API for sensor packages.
 */
'use strict';

const Influx = require('influx');

module.exports = function setup (options, imports, register) {
    const server = imports.server;
    const logger = imports.logger;
    const influxdb = imports.influxdb;

    /**
     * GET: /api/sensordata/citylab
     */
    server.get('/api/sensordata/citylab', (req, res) => {
        let queries = [];

        let queryParameters = req.query.sensor;

        const location = 'citylab';

        const types = {
            battery: {
                title: 'Batteri',
                fa_icon: 'battery-three-quarters',
                unit: '%'
            },
            charging_power: {
                title: 'Ladestrøm',
                fa_icon: 'bolt',
                unit: 'mA'
            },
            air_temperature: {
                title: 'Lufttemperatur',
                fa_icon: 'thermometer-half',
                unit: '°C'
            },
            water_temperature: {
                title: 'Vandtemperatur',
                fa_icon: 'thermometer-half',
                unit: '°C'
            },
            humidity: {
                title: 'Luftfugtighed',
                fa_icon: 'tint',
                unit: '%'
            },
            pressure: {
                title: 'Lufttryk',
                fa_icon: 'tachometer-alt',
                conversion: function (val) {
                    return val * .01;
                },
                unit: 'mBar'
            },
            distance_to_water: {
                title: 'Vandstand',
                fa_icon: 'arrows-v',
                unit: 'cm'
            },
            wind_vane: {
                title: 'Vindretning',
                conversion: function (val) {
                    let values = ['W','WSW','SW','SSW','S','SSE','SE','ESE','E','ENE','NE','NNE','N','NNW','NW','WNW'];
                    return values[val];
                },
                fa_icon: 'compass'
            },
            wind_speed: {
                title: 'Vindhastighed',
                unit: 'km/h',
                fa_icon: 'pennant'
            },
            rain: {
                title: 'Regn',
                unit: 'mm/h',
                fa_icon: 'tint'
            },
            solar_radiation: {
                title: 'Solstråling',
                // @TODO
                unit: '',
                fa_icon: 'sun'
            },
            lux: {
                title: 'Dagslys',
                unit: 'Lux',
                fa_icon: 'sun'
            }
        };

        if (!Array.isArray(queryParameters)) {
            queryParameters = [queryParameters];
        }

        let requests = [];

        for (let sensorParameter of queryParameters) {
            let sensorPair = sensorParameter.split(',');

            requests.push(sensorPair);

            let type = Influx.escape.measurement(sensorPair[1]);
            let sensor = Influx.escape.tag(sensorPair[0]);

            let query = `select * from "${type}" where "sensor" = '${sensor}' order by time desc limit 1`;

            queries.push(query);
        }

        influxdb.query(queries).then(influxResults => {
            let response = [];

            for (let i = 0; i < influxResults.length; i++) {
                for (let j = 0; j < influxResults[i].length; j++) {
                    let result = influxResults[i][j];
                    let request = requests[i];
                    let type = types[request[1]];

                    let res = {
                        sensor: request[0],
                        name: type.title,
                        unit: type.unit,
                        location: location,
                        fa_icon: type.fa_icon,
                        timestamp: result.time.toISOString(),
                        value: type.hasOwnProperty('conversion') ? type.conversion(result.value) : result.value
                    };

                    response.push(res);
                }
            }

            res.json(response);
        }).catch(err => {
            logger.error(err.stack);
            res.status(500).send();
        }).then(() => {
            res.end();
        });
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
