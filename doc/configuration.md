# Configuration

The node app is configured in config.js. Copy the example.config.js to config.js
and adjust to your setup.

## `port`

The port the service is listening on.

## `database_client`

The database client. Eg. 'mariasql' for mariaDB.

## `database_connection`

The database connection configuration.

## `influxdb`

Configuration for access to influxdb.

## `allowed_apikeys`

List of api keys that can be used when sending sensor data.

## `sensor_whitelist`

List af whitelisted sensors. Only data from these servers will be saved.

## `logger`

Logger configuration. Set `level` to decide which level of logger messages
should be logged. Set `console` for logging to console. Set `files` for paths
to log files.

## `ckan`

Configuration for delivery of sensor data to a CKAN.
`packageId` is the name of the dataset in CKAN.
`tableName` is the name of the resource in CKAN.
`apikey` is the api key from CKAN.
`url` is the url to CKAN.
`resource` is the id of the resource in CKAN.
`indexes` is an array of the columns thats should be indexes in CKAN.
`primaryKeys` is an array of columns in CKAN that together make up the primary
key.
`schema` is an array of the columns that should be created in CKAN.
