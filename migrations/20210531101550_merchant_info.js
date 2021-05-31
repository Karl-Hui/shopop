exports.up = function (knex) {
  return knex.schema.createTable("merchant_info", (table) => {
    table.increments().primary();
    table.string("profilePic");
    table.string("shopDescription");
    table.string("socialMediaURL");
    table.integer("merchant_id").unsigned();
    table.foreign("merchant_id").references("merchant.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("merchant_info");
};
