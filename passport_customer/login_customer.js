//++++++++++++++knex set up+++++++++++++++++++++++++++
const database = require("../knexfile").development;
const knex = require("knex")(database);

const hashFunction = require("./hashFunction");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async (email, password, done) => {
  // console.log("login");
  try {
    let customer = await knex("customer").where({
      email: email,
    });
    if (customer.length === 0) {
      return done(null, false, {
        message: "email does not exists",
      });
    }
    // // console.log(user[0].hash);
    let result = await hashFunction.checkPassword(password, customer[0].hash);
    // console.log("customer", customer);
    // console.log("password", result);
    if (result) {
      return done(null, customer);
    } else {
      return done(null, false, {
        message: " incorrect email/password",
      });
    }
  } catch (err) {
    done(err);
  }
});
