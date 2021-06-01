const passportMerchant = require("passport");

const merchantSignupStrategy = require("./signup_merchant");
const merchantSerialize = require("./merchantSerilize");
const merchantLogin = require("./login_merchant");


passportMerchant.use("local-merchantSignup", merchantSignupStrategy);
passportMerchant.use("local-merchantLogin", merchantLogin);

passportMerchant.serializeUser(merchantSerialize.serializeUser);
passportMerchant.deserializeUser(merchantSerialize.deserializeUser);

module.exports = passportMerchant;
