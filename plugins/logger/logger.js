/**
 * @file
 * Logger module, uses Winston.
 */
'use strict';

const winston = require('winston');
const config = require('../../config');

module.exports = function setup(options, imports, register) {
    const logger = winston.createLogger({
        level: config.logger.level,
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: config.logger.files.error, level: 'error' }),
            new winston.transports.File({ filename: config.logger.files.info })
        ]
    });

    // To console if enabled.
    if (config.logger.console) {
        logger.add(new winston.transports.Console({
            format: winston.format.simple()
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
