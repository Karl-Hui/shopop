const database = require("../knexfile").development;
const knex = require("knex")(database);

function serializeUser(user, done) {
  // if (Array.isArray(user)) {
  //   done(null, user[0].id);
  // } else {
  // console.log("serializeUser user: ", user);
  // console.log("Has merchant name", user[0].merchantName);
  // console.log("useruseruseruseruser", user);
  if(Array.isArray(user)){
    let obj = {
      userId: user[0].id,
      isMerchantName: user[0].merchantName,
    };
    console.log("objobjobjobjobj", obj);
    done(null, obj);
  } else {
    let obj = {
      userId: user.id,
      isMerchantName: user.merchantName,
    };
    console.log("objobjobjobjobj", obj);
    done(null, obj);
  }
  // }
}

function deserializeUser(obj, done) {
  // console.log("+++++++++++", user);
  // console.log("Deserialize user!", id);
  if (obj.isMerchantName) {
    knex("merchant")
      .select("*")
      .where({ id: obj.userId })
      .then((user) => {
        console.log("deserializeUser: ", user[0]);
        done(null, user[0]);
      });
  } else {
    knex("customer")
      .select("*")
      .where({ id: obj.userId })
      .then((user) => {
        console.log("deserializeUser: ", user[0]);
        done(null, user[0]);
      });
  }
}
module.exports = {
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
};
