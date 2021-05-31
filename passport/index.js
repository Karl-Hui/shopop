const passport = require("passport");

const customerSignupStrategy = require("./signup_customer");
const customerSerialize = require("./customerSerilize");

passport.use("local-customerSignup", customerSignupStrategy);

passport.serializeUser(customerSerialize.serializeUser);
passport.deserializeUser(customerSerialize.deserializeUser);

module.exports = passport;
