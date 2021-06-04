exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("checkout_cart")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("checkout_cart").insert([
        {
          product_info_id: "1",
          purchaseQuantity: "1",
          customer_info: "1",
        },
        {
          product_info_id: "3",
          purchaseQuantity: "1",
          customer_info: "1",
        },
        {
          product_info_id: "2",
          purchaseQuantity: "1",
          customer_info: "1",
        },
        {
          product_info_id: "1",
          purchaseQuantity: "1",
          customer_info: "1",
        },
        {
          product_info_id: "1",
          purchaseQuantity: "1",
          customer_info: "1",
        },
      ]);
    });
};
