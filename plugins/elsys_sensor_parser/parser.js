'use strict';

const Parser = require('binary-parser').Parser;

let temperatureParser = new Parser()
    .uint16('temperature', {
        formatter: function(value) {

            return value / 10;
        }
    });

let humidityParser = new Parser()
    .uint8('humidity');

let accelerationLevelParser = new Parser()
    .bit3('acceleration_level');

let lightParser = new Parser()
    .uint16('light');

let motionParser = new Parser()
    .uint8('motion');

let co2parser = new Parser()
    .uint16('co2');

let batteryParser = new Parser()
    .uint16('battery');

let analogParser = new Parser()
    .uint16('analog');

let gpsParser = new Parser()
    .bit3('lat')
    .bit3('long');

let pulseCountParser = new Parser()
    .uint16('pulse_count');

let pulseCountAbsoluteParser = new Parser()
    .uint32('pulse_count_absolute');

let externalDigitalButtonParser = new Parser()
    .bit1('external_digital_button');

let externalDistanceParser = new Parser()
    .uint16('external_distance');

let accelerationMovementsParser = new Parser()
    .uint8('acceleration_movements');

let externalIrTemperature = new Parser()
    .uint8('internal_temperature')
    .uint8('external_temperature');

let occupancyParser = new Parser()
    .bit1('occupancy');

let externalWaterLeakParser = new Parser()
    .bit1('external_water_leak');

let grideyeParser = new Parser()
    .bit1('ref')
    .string('pixel', {
        encoding: 'hex',
        length: 64
    });

let pressureParser = new Parser()
    .uint32('pressure');

let soundParser = new Parser()
    .bit1('peak')
    .bit1('average');

let debugParser = new Parser()
    .bit4('debug_data');

let sensorSettingsParser = new Parser()
    .string('settings', {
        greedy: true
    });

let parser = new Parser()
    .uint8('type')
    .choice('data', {
        tag: 'type',
        choices: {
            1: temperatureParser,
            2: humidityParser,
            3: accelerationLevelParser,
            4: lightParser,
            5: motionParser,
            6: co2parser,
            7: batteryParser,
            8: analogParser,
            9: gpsParser,
            10: pulseCountParser,
            11: pulseCountAbsoluteParser,
            12: temperatureParser,
            13: externalDigitalButtonParser,
            14: externalDistanceParser,
            15: accelerationMovementsParser,
            16: externalIrTemperature,
            17: occupancyParser,
            18: externalWaterLeakParser,
            19: grideyeParser,
            20: pressureParser,
            21: soundParser,
            22: pulseCountParser,
            23: pulseCountAbsoluteParser,
            24: analogParser,
            25: temperatureParser,
            26: externalDigitalButtonParser,
            61: debugParser,
            62: sensorSettingsParser
        }
    });

module.exports.elsysSensorParser = function() {

    return new Parser()
        .array("data", {
            type: parser,
            readUntil: 'eof'
        });
};
