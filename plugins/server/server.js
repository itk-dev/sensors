/**
 * @file
 * Server plugin. Adds a server and serves public folder.
 */

'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./../../config');

module.exports = function setup(options, imports, register) {
    let app = express();

    // Parse json and urlencoded bodies.
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    /**
     * GET: /
     *
     * Serves the homepage.
     */
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../public/index.html'));
    });

    /**
     * Start listening to port.
     */
    app.listen(config.port);

    /**
     * Register with architect.
     */
    register(null, {
        server: app
    });
};
