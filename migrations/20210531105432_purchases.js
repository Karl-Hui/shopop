exports.up = function (knex) {
  return knex.schema.createTable("purchases", (table) => {
    table.increments().primary();
    table.string("shopReview");
    table.integer("product_info_id").unsigned();
    table.foreign("product_info_id").references("product_info.id");
    table.integer("merchant_id").unsigned();
    table.foreign("merchant_id").references("merchant.id");
    table.timestamps(false, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("purchases");
};
