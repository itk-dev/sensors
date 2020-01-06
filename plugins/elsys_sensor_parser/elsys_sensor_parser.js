'use strict';

const parser = require('./parser').elsysSensorParser();

module.exports = function setup(options, imports, register) {

    const elsysSensorParser = {

        parse: function(data) {

            return parser.parse(
                Buffer.from(data, 'hex')
            );
        },
    };

    /**
     * Register with architect.
     */
    register(null, {
        elsysSensorParser: elsysSensorParser
    });
};
