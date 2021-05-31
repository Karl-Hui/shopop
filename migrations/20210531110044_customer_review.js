exports.up = function (knex) {
  return knex.schema.createTable("customer_review", (table) => {
    table.increments().primary();
    table.text("shopReview");
    table.integer("shopRating");
    table.integer("merchant_info_id").unsigned();
    table.foreign("merchant_info_id").references("merchant_info.id");
    table.integer("customer_id").unsigned();
    table.foreign("customer_id").references("customer.id");
    table.integer("purchases_id").unsigned();
    table.foreign("purchases_id").references("purchases.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("customer_review");
};
