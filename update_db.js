const mariadb = require('mariasql');
const config = require('./config');

let db = {
    host: config.mariadb.host,
    user: config.mariadb.user,
    password: config.mariadb.password,
    db: config.mariadb.db
};

let c = new mariadb(db);

if (process.argv[2] === '--help') {
    console.log('node update_db 1 - to add sensor_td field to table');
}
else if (process.argv[2] === '1') {
    console.log("updating table");

    c.query('ALTER TABLE sensor ADD sensor_ts INT;', function (err) {
        if (err) {
            throw err;
        }
    });
}

c.end();
