exports.up = function (knex) {
  return knex.schema.createTable("customer", (table) => {
    table.increments().primary();
    table.string("email");
    table.string("username").unique();
    table.string("hash");
    table.string("facebook_id");
    table.string("gmail_id");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customer");
};
