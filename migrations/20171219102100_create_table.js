exports.up = function(knex, Promise) {
    return knex.schema.createTable('sensor', (table) => {
        table.increments('id');
        table.string('sensor');
        table.integer('sequence');
        table.bigInteger('sensor_ts');
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.specificType('data', 'blob').defaultTo(null);
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('sensor');
};
