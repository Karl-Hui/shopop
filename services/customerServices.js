require("dotenv").config({ path: "../.env" });
const database = require("../knexfile").development;
const knex = require("knex")(database);

const Table_Name = "customer";

class CustomerServices {
  constructor(knex) {
    this.knex = knex;
  }

  getCustomerName(customerId) {
    return this.knex("customer")
      .select()
      .where({ id: customerId })
      .then((data) => {
        // console.log("this is customer data:", data[0].username);
        return data[0].username;
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
}
//test
// let service = new CustomerServices(knex);
// service.getCustomerName(1);
// console.log("hi");

module.exports = CustomerServices;
