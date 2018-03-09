/**
 * @file
 * Logger module, uses Winston.
 */
'use strict';

const config = require('../../config');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

module.exports = function setup(options, imports, register) {
    const myFormat = printf(info => {
        return `${info.timestamp} ${info.level}: ${info.message}`;
    });

    const logger = createLogger({
        level: config.logger.level,
        format: combine(
            timestamp(),
            myFormat
        ),
        transports: [
            new transports.File({ filename: config.logger.files.error, level: 'error' }),
            new transports.File({ filename: config.logger.files.info })
        ]
    });

    // To console if enabled.
    if (config.logger.console) {
        logger.add(new transports.Console({
            format: format.simple()
        }));
    }

    logger.info('Logger up');

    /**
     * Register with architect.
     */
    register(null, {
        logger: logger
    });
};
