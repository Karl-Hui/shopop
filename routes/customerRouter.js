const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// let currentCustomer;
let customer_id;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    customer_id = req.user.id;
    // console.log(req.user.id)
    console.log("logged in as id:", req.user.id);
    return next();
  }
  res.redirect("/customer-login");
}

class CustomerRouter {
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

    router.get(
      "/customer-settings",
      isLoggedIn,
      this.getAllCustomerData.bind(this)
    );

    router.post(
      "/customer-homepage",
      isLoggedIn,
      upload.single("customer-image"),
      this.post_image.bind(this)
    );

    router.get("/cart", isLoggedIn, this.checkOutPage.bind(this));

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
  customer_settings(req, res) {
    console.log("kjasdhfkasdhfksahfdsah");
    this.customerServices.getCustomerInfo(customer_id).then((data) => {
      console.log("customersettings-info", data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }
  getAllCustomerData(req, res) {
    console.log("this is all the cusomters data");
    this.customerServices.getAllCustomerInfo(customer_id).then((data) => {
      console.log("data for customer settings", data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }

  post_image(req, res) {
    console.log("req.file", req.file.path);
    let profilePictureURL = req.file.path;
    this.customerServices
      .postImage(customer_id, profilePictureURL)
      .then(() => {
        console.log("done");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  checkOutPage(req, res) {
    this.customerServices
      .getCart(customer_id)
      .then((data) => {
        console.log("checkout page");
        res.render("cart", {
          data: data,
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

module.exports = CustomerRouter;
