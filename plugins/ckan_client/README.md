# CKAN client

## Creating datastore table and resource in CKAN

Configure the ckan in config.js

```
    packageId: '[The name of the dataset in CKAN]',
    tableName: '[Resource name]',
    apikey: '[The CKAN api key]',
    url: '[The CKAN url]',
    indexes: [
        'sensor', 'sensor_id', 'time', 'type'
    ],
    primaryKeys: [
        'sensor', 'sensor_id', 'time'
    ],
    schema: [
        {
            'id': 'sensor',
            'type': 'text'
        },
        {
            'id': 'type',
            'type': 'text'
        },
        {
            'id': 'sensor_id',
            'type': 'smallint'
        },
        {
            'id': 'time',
            'type': 'timestamp'
        },
        {
            'id': 'value',
            'type': 'float'
        }
    ]
```

Run
```
node create_ckan_tables.js
```

Get the resource_id from the response from CKAN and insert it into the config.js.

After this the plugin will push content to CKAN when new sensor data has been
received.
