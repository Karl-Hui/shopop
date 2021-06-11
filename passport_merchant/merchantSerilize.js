const database = require("../knexfile").development;
const knex = require("knex")(database);

function serializeUser(user, done) {
  if (Array.isArray(user)) {
    let obj = {
      userId: user[0].id,
      isMerchantName: user[0].merchantName,
    };
    done(null, obj);
  } else {
    let obj = {
      userId: user.id,
      isMerchantName: user.merchantName,
    };
    done(null, obj);
  }
  // }
}

function deserializeUser(obj, done) {
  // console.log("Deserialize user!", id);
  if (obj.isMerchantName) {
    knex("merchant")
      .select("*")
      .where({
        id: obj.userId,
      })
      .then((user) => {
        // console.log("deserializeUser: ", user[0]);
        done(null, user[0]);
      });
  } else {
    knex("customer")
      .select("*")
      .where({
        id: obj.userId,
      })
      .then((user) => {
        // console.log("deserializeUser: ", user[0]);
        done(null, user[0]);
      });
  }
}
module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
