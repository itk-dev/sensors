/**
 * @file
 * Migration to add payload column.
 */

/**
 * Migration up.
 *
 * Adds the "payload" column of type json.
 *
 * @param knex
 * @return {*}
 */
exports.up = function (knex) {
    return knex.schema.table('sensor', function (table) {
        'use strict';

        table.json('payload');
    });
};

/**
 * Migration down.
 *
 * Remove payload column.
 *
 * @param knex
 * @return {*}
 */
exports.down = function (knex) {
    return knex.schema.table('sensor', function (table) {
        'use strict';

        table.dropColumn('payload');
    });
};
