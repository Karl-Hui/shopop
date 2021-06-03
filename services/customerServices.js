require("dotenv").config({ path: "../.env" });
const database = require("../knexfile").development;
const knex = require("knex")(database);

class CustomerServices {
  constructor(knex) {
    this.knex = knex;
  }

  getCustomerName(customerId) {
    return this.knex("customer")
      .select()
      .where({ id: customerId })
      .then((data) => {
        console.log("this is customer data:", data[0].username);
        return data[0].username;
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  getCustomerInfo(customerId) {
    return this.knex("customer_info")
      .select()
      .where({ customer_id: customerId })
      .then((data) => {
        console.log("This data belongs to customer:", data);
        return data[0];
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  getAllCustomerInfo(customerId) {
    return this.knex("customer")
      .join("customer_info", "customer.id", "customer_id")
      .select()
      .where({ customer_id: customerId })
      .then((data) => {
        console.log("customerInfo here blach", data);
        return data[0];
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  postImage(user_id, imageURL) {
    const newImage = {
      profilePicture: imageURL,
    };
    return knex("customer_info")
      .update("profilePicture", newImage)
      .where({ customer_id: user_id })
      .then(() => {
        console.log("added profile Pic!");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  getCart(user_id) {
    return knex
      .from("checkout_cart")
      .innerJoin(
        "product_info",
        "checkout_cart.product_info_id",
        "product_info.id"
      )
      .select()
      .where({ product_info_id: user_id })
      .then((data) => {
        console.log("the getCart", data);
        return data;
      });
    // knex("checkout_cart")
    //   .where({ customer_info: user_id })
    //   .then((data) => {
    //     console.log("the getCart", data);
    //   });
  }
}
//test
let service = new CustomerServices(knex);
// service.getCustomerInfo(1);
// console.log("hi");
// service.getCart(1).then(() => {
//   console.log("cart get");
// });

module.exports = CustomerServices;
