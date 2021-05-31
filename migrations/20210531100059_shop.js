exports.up = function (knex) {
  return knex.schema.createTable("merchant", (table) => {
    table.increments().primary();
    table.string("merchantName").unique();
    table.string("email");
    table.string("hash");
    table.string("facebook_id");
    table.string("gmail_id");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("merchant");
};
