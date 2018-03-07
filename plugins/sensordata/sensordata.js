/**
 * @file
 * Sensordata module. Provides API for getting sensor data.
 */
'use strict';

const Influx = require('influx');
const Q = require('q');

module.exports = function setup (options, imports, register) {
    const server = imports.server;
    const logger = imports.logger;
    const influxdb = imports.influxdb;

    /**
     * Conversion where result is floored.
     *
     * @param result
     * @return {*}
     */
    const conversionFloor = (result) => {
        result.value = Math.floor(result.value);
        return result;
    };

    /**
     * Conversion for temperature.
     *
     * @param result
     * @return {*}
     */
    const conversionTemperature = (result) => {
        result.value = Math.floor(result.value);

        if (result.value <= 0) {
            result.icon_classes = 'fas fa-thermometer-empty';
        }
        else if (result.value > 0 && result.value <= 10) {
            result.icon_classes = 'fas fa-thermometer-quarter';
        }
        else if (result.value > 10 && result.value <= 20) {
            result.icon_classes = 'fas fa-thermometer-half';
        }
        else if (result.value > 20 && result.value <= 30) {
            result.icon_classes = 'fas fa-thermometer-half';
        }
        else {
            result.icon_classes = 'fas fa-thermometer-full';
        }

        return result;
    };

    /**
     * Conversion for pressure.
     *
     * Converts from Pascal to mBar.
     *
     * @param result
     * @return {*}
     */
    const conversionPressure = (result) => {
        result.value = Math.floor(result.value * .01);
        return result;
    };

    /**
     * Conversion for wind vane.
     *
     * Converts values to directions.
     *
     * @param result
     * @return {*}
     */
    const conversionWindVane = (result) => {
        let values = ['V', 'VSV', 'SV', 'SSV', 'S', 'SSØ', 'SØ', 'ØSØ', 'Ø', 'ØNØ', 'NØ', 'NNØ', 'N', 'NNV', 'NV', 'VNV'];

        result.icon_rotate = result.icon_classes + ' rotate-' + Math.floor(-29 - 90 - result.value * 22.5);

        result.value = values[result.value];
        return result;
    };

    /**
     * Conversion for distance to water.
     *
     * Converts to difference from normal water level.
     *
     * @param result
     * @return {*}
     */
    const conversionDistanceToWater = (result) => {
        result.value = Math.floor(-1 * (result.value - 196));
        return result;
    };

    /**
     * Convertion for wind speed.
     *
     * Converts from km/h to m/s.
     *
     * @param result
     */
    const conversionWindSpeed = (result) => {
        result.value = Math.floor(result.value / 3.6);
        result.unit = 'm/s';
    };

    // Array of standard values for the different sensors.
    const types = {
        battery: {
            title: 'Batteri',
            count_up: true,
            icon_classes: 'fas fa-battery-three-quarters',
            unit: '%'
        },
        charging_power: {
            title: 'Ladestrøm',
            count_up: true,
            icon_classes: 'fas fa-bolt',
            unit: 'mA'
        },
        air_temperature: {
            title: 'Lufttemperatur',
            count_up: true,
            icon_classes: 'fas fa-thermometer-half',
            conversion: conversionTemperature,
            unit: '°C'
        },
        water_temperature: {
            title: 'Vandtemperatur',
            count_up: true,
            icon_classes: 'fas fa-thermometer-half',
            conversion: conversionTemperature,
            unit: '°C'
        },
        humidity: {
            title: 'Luftfugtighed',
            count_up: true,
            icon_classes: 'fas fa-tint',
            conversion: conversionFloor,
            unit: '%'
        },
        pressure: {
            title: 'Lufttryk',
            count_up: true,
            icon_classes: 'fas fa-tachometer-alt',
            conversion: conversionPressure,
            unit: 'mBar'
        },
        distance_to_water: {
            title: 'Afvigelse fra normalvandstanden',
            count_up: true,
            icon_classes: 'fas fa-arrows-v ',
            conversion: conversionDistanceToWater,
            unit: 'cm'
        },
        wind_vane: {
            title: 'Vindretning',
            count_up: false,
            conversion: conversionWindVane,
            icon_classes: 'fas fa-compass'
        },
        wind_speed: {
            title: 'Vindhastighed',
            count_up: true,
            unit: 'km/h',
            conversion: conversionWindSpeed,
            icon_classes: 'far fa-flag'
        },
        rain: {
            title: 'Regn',
            count_up: true,
            unit: 'mm/h',
            conversion: conversionFloor,
            icon_classes: 'fas fa-tint'
        },
        solar_radiation: {
            title: 'Solstråling',
            count_up: true,
            // @TODO
            unit: '',
            icon_classes: 'fas fa-sun'
        },
        lux: {
            title: 'Dagslys',
            count_up: true,
            unit: 'Lux',
            icon_classes: 'far fa-sun'
        },
        windchillfactor: {
            title: 'Kuldeindeks',
            count_up: true,
            unit: '',
            icon_classes: 'far fa-snowflake'
        }
    };

    /**
     * Creates result.
     *
     * @param result
     * @param request
     * @param type
     * @param location
     * @return Object
     */
    const processQueryResult = (result, sensor, type, location) => {
        let res = {
            sensor: sensor,
            name: type.title,
            unit: type.unit,
            location: location,
            icon_classes: type.icon_classes,
            count_up: type.count_up,
            timestamp: result.time.toISOString(),
            value: result.value
        };

        if (type.hasOwnProperty('conversion')) {
            res = type.conversion(res);
        }

        return res;
    };

    /**
     * Gets the value of one type from a sensor.
     *
     * @param sensor
     * @param type
     * @return {*}
     */
    const getSensorValue = (sensor, type) => {
        let deferred = Q.defer();

        let query = `select * from "${type}" where "sensor" = '${sensor}' order by time desc limit 1`;

        let sensorType = types[type];

        influxdb.query(query).then(influxResults => {
            deferred.resolve(processQueryResult(influxResults[0], sensor, sensorType, 'citylab'));
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    /**
     * Get wind chill factor from sensor.
     *
     * @param sensor
     * @param type
     * @return {*}
     */
    const getWindChillFactor = (sensor, type) => {
        let deferred = Q.defer();
        let queries = [];
        queries.push(`select * from "air_temperature" where "sensor" = '${sensor}' order by time desc limit 1`);
        queries.push(`select * from "wind_speed" where "sensor" = '${sensor}' order by time desc limit 1`);

        influxdb.query(queries).then(influxResults => {
            if (influxResults.length !== 2 || influxResults[0].length !== 1 || influxResults[1].length !== 1) {
                deferred.reject();
                return;
            }

            let t = influxResults[0][0].value;
            // Convert from km/h to m/s.
            let u = influxResults[1][0].value / 3.6;
            // Default to temperature.
            let windChillFactor = t;

            // Only valid if temperature is less than 10 °C, and the wind is greater than 1.3 m/s.
            if (t < 10 && u > 1.3) {
                windChillFactor = 13.12 + 0.6215 * t - 11.37 * Math.pow(u * 3.6, 0.16) + 0.3965 * t * Math.pow(u * 3.6, 0.16);
            }

            let type = types['windchillfactor'];

            let result = {
                sensor: sensor,
                name: type.title,
                unit: type.unit,
                location: 'citylab',
                icon_classes: type.icon_classes,
                count_up: type.count_up,
                timestamp: new Date().toISOString(),
                value: Math.floor(windChillFactor)
            };

            deferred.resolve(result);
        }).catch(err => {
            deferred.reject(err);
        });

        return deferred.promise;
    };

    /**
     * Custom sensor functions should be registered here.
     *
     * @type {{windchillfactor: (function(*=, *))}}
     */
    const customFunctions = {
        windchillfactor: getWindChillFactor
    };

    /**
     * GET: /api/sensordata/citylab
     *
     * Example: /api/sensordata/citylab?sensor=[SENSOR_ID],[TYPE]&sensor=[SENSOR_ID],[TYPE]
     */
    server.get('/api/sensordata/citylab', (req, res) => {
        if (!req.query.hasOwnProperty('sensor')) {
            logger.info('No sensor parameter. Ignoring.');
            res.status(404).send('No sensor selected');
            return;
        }

        let queryParameters = req.query.sensor;

        if (!Array.isArray(queryParameters)) {
            queryParameters = [queryParameters];
        }

        let promises = [];

        for (let sensorParameter of queryParameters) {
            let sensorPair = sensorParameter.split(',');
            let type = Influx.escape.measurement(sensorPair[1]).replace('\'', '');
            let sensor = Influx.escape.measurement(sensorPair[0]).replace('\'', '');

            if (type.match(/'/) || type.match(/"/) || sensor.match(/'/) || sensor.match(/"/)) {
                logger.error('Ignoring request');
                res.status(400).send();
                return;
            }

            if (customFunctions.hasOwnProperty(type)) {
                promises.push(customFunctions[type](sensor, type));
            }
            else {
                promises.push(getSensorValue(sensor, type));
            }
        }

        Q.allSettled(promises)
            .then(function (results) {
                let response = [];

                results.forEach(function (result) {
                    if (result.state === 'fulfilled') {
                        response.push(result.value);
                    }
                });

                res.json(response);
            });
    });

    /**
     * Register with architect.
     */
    register(null, {});
};
