const passport = require("passport");

const customerSignupStrategy = require("./signup_customer");
const customerSerialize = require("./customerSerilize");
const customerLogin = require("./login_customer");

passport.use("local-customerSignup", customerSignupStrategy);
passport.use("local-customerLogin", customerLogin);

passport.serializeUser(customerSerialize.serializeUser);
passport.deserializeUser(customerSerialize.deserializeUser);

module.exports = passport;
