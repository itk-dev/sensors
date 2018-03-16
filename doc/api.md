# API

## Overview

Latest (recent) sensor packages: [`/api/sensorpackage/recent`](http://127.0.0.1:3000/api/sensorpackage/recent)

Latest (recent) data from a sensor: [`/api/recent?sensor=sensor-id`](http://127.0.0.1:3000/api/recent?sensor=0004A30B001E8EA2)

Data for os2display templates: [`/api/sensordata/citylab?sensor=[sensor_id],[type]`](http://127.0.0.1:3000/api/sensordata/citylab?sensor=0004A30B001E8EA2,battery)

Sending sensor data: `/?apikey=api-key` (see [Sending sensor data](#sending-sensor-data))


## Sending sensor data

Before sending sensor data, an [api key must be defined in the
configuration](configuration.md#allowed_apikeys) and the [sensor EUI must
be whitelisted](configuration.md#sensor_whitelist).

Edit `config.js` and add a new api key to [`config.allowed_apikeys`](configuration.md#allowed_apikeys):

```js
config.allowed_apikeys = [
  'some-api-key'
];
```

and whitelist a sensor:

```js
config.sensor_whitelist = [
    …
    '0004A30B001E8EA2',
    …
];
```

Start (or restart) the service to use the new configuration:

```sh
node app.js
```

`POST` sensor data (assuming the service is running on port `3000` (the value
of [`config.port`](configuration.md#port))) to the API end point:

```sh
curl --verbose --header 'content-type: application/json' 'http://127.0.0.1:3000/?apikey=some-api-key' --data @- <<'JSON'
{
   "port" : 4,
   "gws" : [
      {
         "rsig" : [
            {
               "rssisd" : 0,
               "ant" : 0,
               "etime" : "5BU0rQjkq2TbQk4ak4fluw==",
               "chan" : 5,
               "rfbsb" : 100,
               "rssis" : -75,
               "ft2d" : -228,
               "lsnr" : 14,
               "ftime" : -1,
               "rs2s1" : 112,
               "foff" : 12962,
               "rssic" : -74
            }
         ],
         "gweui" : "7076FFFFFF010B88",
         "time" : "2018-02-26T12:31:02.132739024Z",
         "ts" : 1519648262257,
         "rssi" : -74,
         "snr" : 14
      },
      {
         "time" : "2018-02-26T12:31:05.277497Z",
         "ts" : 1519648262253,
         "rssi" : -100,
         "snr" : 3.2,
         "rsig" : [
            {
               "ant" : 0,
               "chan" : 5,
               "rssic" : -100,
               "lsnr" : 3.2
            }
         ],
         "gweui" : "7076FFFFFF010B32"
      }
   ],
   "seqno" : 38120,
   "dr" : "SF7 BW125 4/5",
   "data" : "5a2c345fba00004a5c8f42bf4c002c70424de97eca474e400c0000a1c6c145429c9a9999409d0a9f00000000",
   "bat" : 255,
   "EUI" : "0004A30B001E8EA2-xxx",
   "ack" : false,
   "ts" : 1519648262253,
   "fcnt" : 11354,
   "freq" : 868100000,
   "cmd" : "gw",
   "toa" : 107
}
JSON
```

The response status code will be `201 Created` on success. If not
successful, check the log files in `logs/` for details on what is
wrong.

## API

### GET: /api/recent?sensor=[sensor_id]

Open [`/api/recent?sensor=0004A30B001E8EA2`](http://127.0.0.1:3000/api/recent?sensor=0004A30B001E8EA2) to see the lastest [parsed sensor data](parsers.md).

### GET: /api/sensordata/citylab?sensor=[sensor_id],[type]

Get results formatted for use in os2display.

eg. /api/sensordata/citylab?sensor=0004A30B001E307C,air_temperature&sensor=0004A30B001E8EA2,windchillfactor

Current available types:

* battery
* charging_power
* air_temperature
* water_temperature
* humidity
* pressure
* distance_to_water
* wind_vane
* wind_speed
* rain
* solar_radiation
* lux
* windchillfactor

If a result is not available (eg. if the type is not available for a sensor) it will not be included.
