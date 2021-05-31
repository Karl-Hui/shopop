exports.up = function (knex) {
  return knex.schema.createTable("checkout_cart", (table) => {
    table.increments().primary();
    table.integer("product_info_id").unsigned();
    table.foreign("product_info_id").references("product_info.id");
    table.integer("purchaseQuantity").unsigned();
    table.integer("customer_info").unsigned();
    table.foreign("customer_info").references("customer_info.id");
    table.integer("purchases_id").unsigned();
    table.foreign("purchases_id").references("purchases.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("checkout_cart");
};
