# sensors
Nodejs to collect sensor data.

## Install
Install modules

```sh
npm install
```

Create a configuration file from example.config.js

```sh
cp example.config.js config.js
```
Edit the config to your needs.

Setup the database with

```sh
node_modules/knex/bin/cli.js migrate:latest
```

## Running
```sh
node app.js
```
