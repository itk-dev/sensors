/**
 * @file
 * Main app that sets up api and homepage.
 */
'use strict';

const architect = require('architect');

// Use the configuration to start the application.
const appConfig = architect.loadConfig(__dirname + '/architect_config.js');
architect.createApp(appConfig, (err, app) => {
    if (err) {
        console.error(err.stack);
    }
});
