const hashFunction = require("./hashFunction");

const database = require("../knexfile").development;
const knex = require("knex")(database);

const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy({ passReqToCallback: true }, async (req) => {
  console.log(req.body);
});
