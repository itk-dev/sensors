# sensors
Nodejs to collect sensor data.

## Install

Get containers up and running and install packages

```sh
docker-compose pull
docker-compose up --detach

docker-compose exec node /bin/bash npm_install.sh
```

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
docker-compose exec node /bin/bash npm_upgrade.sh
```

## Documentation

See `doc/`folder for documentation.
