exports.up = function (knex) {
  return knex.schema.createTable("customer_info", (table) => {
    table.increments().primary();
    table.string("profilePicture");
    table.text("building_address");
    table.text("street_address");
    table.text("country_address");
    table.integer("customer_id").unsigned();
    table.foreign("customer_id").references("customer.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customer_info");
};
