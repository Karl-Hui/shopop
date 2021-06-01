const hashFunction = require("./hashFunction");

const database = require("../knexfile").development;
const knex = require("knex")(database);

const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(
    { passReqToCallback: true },
    async (req, email, password, done) => {
      //   console.log(req.body);
  
      try {
        let username = await knex("merchant").where({
          username: req.body.username,
        });
        if (username.length > 0) {
          return done(null, false, {
            message: "user name already exists",
          });
        }
        let shop = await knex("merchant").where({
          email: req.body.email,
        });
        if (shop.length > 0) {
          return done(null, false, {
            message: "user already exists",
          });
        }
        let hashPassword = await hashFunction.hashPassword(req.body.password);
        // assign value to customer table
        const newMerchant = {
          merchantName: req.body.username,
          email: req.body.email,
          hash: hashPassword,
        };
        // inserting into table
        let merchantId = await knex("customer").insert(merchant).returning("id");
        newMerchant.id = merchantId[0]
        console.log("New merchant", newMerchant)
        done(null, newMerchant);
      } catch (err) {
        console.log(err);
      }
    }
  );