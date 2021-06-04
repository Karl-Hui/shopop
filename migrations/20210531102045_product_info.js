exports.up = function (knex) {
  return knex.schema.createTable("product_info", (table) => {
    table.increments().primary();
    table.json("productPhoto");
    table.string("productName");
    table.text("productDescription");
    table.integer("stock");
    table.decimal("price");
    table.decimal("shippingPrice");
    table.string("Size");
    table.string("productCondition");
    table.string("productCategory");
    table.string("productStatus");
    table.integer("merchant_id").unsigned();
    table.foreign("merchant_id").references("merchant.id");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("product_info");
};