const database = require("../knexfile").development;
const knex = require("knex")(database);

function serializeUser(user, done) {
  if (Array.isArray(user)) {
    done(null, user[0].id);
  } else {
    done(null, user.id);
  }
}

function deserializeUser(id, done) {
  // console.log("+++++++++++", user);
  // console.log("Deserialize user!", id);
  knex("merchant")
    .select("*")
    .where({ id: id })
    .then((user) => {
      console.log("deserializeUser: ", user[0]);
      done(null, user[0]);
    });
}
module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
