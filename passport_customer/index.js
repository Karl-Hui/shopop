const passportCustomer = require("passport");

const customerSignupStrategy = require("./signup_customer");

const customerSerialize = require("./customerSerilize");
const customerLogin = require("./login_customer");

passportCustomer.use("local-customerSignup", customerSignupStrategy);
passportCustomer.use("local-customerLogin", customerLogin);

// passportCustomer.serializeUser(customerSerialize.serializeCustomer);
// passportCustomer.deserializeUser(customerSerialize.deserializeUser);

module.exports = passportCustomer;
