# sensors
Nodejs to collect sensor data.

## Install
Install modules. This script installs modules for all plugins.

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
npm run start
```

## Upgrading modules

```sh
./npm_upgrade.sh
```

## Documentation

See `doc/`folder for documentation.
