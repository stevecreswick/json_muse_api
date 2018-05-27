exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.uuid('uuid');
    table.string('name').notNullable().unique();
    table.string('email').notNullable().unique();
    table.text('token');
    table.text('password_digest');
    table.timestamps(true, true);
});

};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
