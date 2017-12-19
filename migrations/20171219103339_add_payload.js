exports.up = function (knex, Promise) {
    return knex.schema.table('sensor', function (table) {
        'use strict';

        table.json('payload');
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('sensor', function (table) {
        'use strict';

        table.dropColumn('payload');
    });
};
