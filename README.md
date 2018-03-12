# sensors
Nodejs to collect sensor data.

## Install
Install modules

```sh
./npm_install.sh
```

Create a configuration file from example.config.js

```sh
cp example.config.js config.js
```
Edit the config to your needs.

Setup the database with

```sh
npm run migrate
```

## Running
```sh
node app.js
```

## Upgrading modules

```sh
./npm_upgrade.sh
```

## API

### GET: /api/sensordata/citylab?sensor=[sensor_id],[type]

Get results formatted for use in os2display.

eg. /api/sensordata/citylab?sensor=0004A30B001E307C,air_temperature&sensor=0004A30B001E8EA2,windchillfactor

Custom types:
* windchillfactor

If a result is not available (eg. if the type is not available for a sensor) it will not be included.
