# sensors
Nodejs to collect sensor data.

## Install

Get containers up and running and install packages

```sh
docker-compose pull
docker-compose up --detach

docker-compose exec node ./npm_install.sh
```
> **_NOTE_** All arguments passed to npm_install.sh will be passed on to the npm install command.

Create a configuration file from example.config.js

```sh
cp example.config.js config.js
```
Edit the config to your needs.

Setup the database with

```sh
docker-compose exec node npm run migrate
```

## Upgrading modules

```sh
docker-compose exec node ./npm_upgrade.sh
```
> **_NOTE_** All arguments passed to npm_upgrade.sh will be passed on to the npm install command.

## Documentation

See `doc/`folder for documentation.
