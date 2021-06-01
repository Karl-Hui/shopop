const hashFunction = require("../passport_merchant/hashFunction");

const database = require("../knexfile").development;
const knex = require("knex")(database);

const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(
  { passReqToCallback: true },
  async (req, email, password, done) => {
    //   console.log(req.body);

    try {
      let username = await knex("customer").where({
        username: req.body.username,
      });
      if (username.length > 0) {
        return done(null, false, {
          message: "user name already exists",
        });
      }
      let users = await knex("customer").where({
        email: req.body.email,
      });
      if (users.length > 0) {
        return done(null, false, {
          message: "user already exists",
        });
      }
      let hashPassword = await hashFunction.hashPassword(req.body.password);
      // assign value to customer table
      const customer = {
        username: req.body.username,
        email: req.body.email,
        hash: hashPassword,
      };
      // inserting into table
      let customerId = await knex("customer").insert(customer).returning("id");

      // assigning info to customer_info
      const customer_info = {
        building_address: req.body.building,
        street_address: req.body.address,
        country_address: req.body.country,
        customer_id: customerId[0],
      };
      //   customer_info[customer_id] = customerId[0];
      let customer_infomation = await knex("customer_info").insert(
        customer_info
      );
      let newCustomer = {
        ...customer,
        ...customer_info,
        id: customerId[0],
      };
      console.log("newCustomer", newCustomer);
      done(null, newCustomer);
    } catch (err) {
      console.log(err);
    }
  }
);
