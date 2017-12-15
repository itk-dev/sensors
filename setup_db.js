const mariadb = require('mariasql');
const config = require('./config');

let db = {
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
};

let c = new mariadb(db);

c.query('CREATE DATABASE IF NOT EXISTS ' + config.mariadb.db + ';', function () {
    c.query('CREATE TABLE IF NOT EXISTS ' + config.mariadb.db + '.sensor ' +
    '(`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    '`sensor` VARCHAR(32), ' +
    '`sequence` INT, ' +
    '`sensor_td` INT, ' +
    '`timestamp` TIMESTAMP, `data` BLOB);', function (err) {
        if (err) {
            throw err;
        }
    });
});

c.end();
