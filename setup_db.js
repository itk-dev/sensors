const mariadb = require('mariasql');
const config = require('./config');

let c = new mariadb(config.mariadb);

c.query('DROP DATABASE IF EXISTS ' + config.mariadb.db + ';');

c.query('CREATE DATABASE IF NOT EXISTS ' + config.mariadb.db + ';', function (err) {

  console.log("Creating table: " + config.mariadb.db + ".sensor if it does not exist.");

  c.query('CREATE TABLE IF NOT EXISTS ' + config.mariadb.db + '.sensor ' +
    '(`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY, ' +
    '`sensor` VARCHAR(32), ' +
    '`sequence` INT, ' +
    '`timestamp` TIMESTAMP, `data` BLOB);', function (err, rows) {
    if (err) {
      throw err;
    }
  });
});

c.end();
