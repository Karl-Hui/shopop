const bcrypt = require("bcrypt");

function hashPassword(realPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt((err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(realPassword, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            // console.log(hash);
            resolve(hash);
          }
        });
      }
    });
  });
}

function checkPassword(realPassword, hashPassword) {
  return new Promise((resolve, reject) => {
    // console.log("checking password");
    bcrypt.compare(realPassword, hashPassword, (err, match) => {
      if (err) {
        console.log("err", err);
        reject(err);
      } else {
        // console.log(match);
        resolve(match);
      }
    });
  });
}

module.exports = {
  checkPassword: checkPassword,
  hashPassword: hashPassword,
};
