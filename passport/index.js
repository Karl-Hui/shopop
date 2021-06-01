const passport = require("passport");

const customerSignupStrategy = require("./signup_customer");
const merchantSignupStrategy = require("./signup_merchant");

const customerSerialize = require("./customerSerilize");
const customerLogin = require("./login_customer");
const merchantLogin = require("./login_merchant");

passport.use("local-customerSignup", customerSignupStrategy);
passport.use("local-customerLogin", customerLogin);

passport.use("local-merchantSignup", merchantSignupStrategy);
passport.use("local-merchantLogin", merchantLogin);

passport.serializeUser(customerSerialize.serializeUser);
passport.deserializeUser(customerSerialize.deserializeUser);

module.exports = passport;
