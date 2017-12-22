/**
 * @file
 * Migration to add sensor table.
 */

/**
 * Migration up.
 *
 * Adds the sensor table.
 *
 * @param knex
 * @return {*}
 */
exports.up = function(knex) {
    return knex.schema.createTable('sensor', (table) => {
        table.increments('id');
        table.string('sensor');
        table.integer('sequence');
        table.bigInteger('sensor_ts');
        table.timestamp('timestamp').defaultTo(knex.fn.now());
        table.specificType('data', 'blob').defaultTo(null);
    });
};

/**
 * Migration down.
 *
 * Removes the sensor table.
 *
 * @param knex
 * @return {*}
 */
exports.down = function(knex) {
    return knex.schema.dropTable('sensor');
};
