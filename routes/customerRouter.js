const express = require("express");

// let currentCustomer;
let customer_id;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    customer_id = req.user.id;
    // console.log(req.user.id)
    console.log("logged in as id:", req.user.id);
    return next();
  }
  res.redirect("/login");
}

class customerRouter {
  constructor(customerServices) {
    this.customerServices = customerServices;
  }

  router() {
    const router = express.Router();
    router.get(
      "/customer-homepage",
      isLoggedIn,
      this.customer_homepage.bind(this)
    );
    return router;
  }

  customer_homepage(req, res) {
    this.customerServices.getCustomerName(customer_id).then((customerName) => {
      console.log(customerName);
      res.render("customer-homepage", {
        layout: "customerLoggedIn",
        customerName: customerName,
      });
    });
  }
}

module.exports = customerRouter;
