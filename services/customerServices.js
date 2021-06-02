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
}
//test
// let service = new CustomerServices(knex);
// service.getCustomerName(1);
// console.log("hi");

module.exports = CustomerServices;
