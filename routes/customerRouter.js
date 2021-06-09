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
    // console.log("logged in as id:", req.user.id);
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
    router.put("/customer-settings", isLoggedIn, this.editUsername.bind(this));
    router.put("/customer-address", isLoggedIn, this.editAddress.bind(this));
    router.post(
      "/customer-settings",
      isLoggedIn,
      upload.single("customer-image"),
      this.post_image.bind(this)
    );
    router.get("/cart", isLoggedIn, this.checkOutPage.bind(this));
    router.post("/cart", isLoggedIn, this.updateCart.bind(this));
    router.get("/product/:id", isLoggedIn, this.oneProductPage.bind(this));
    router.post("/product/:id", isLoggedIn, this.postToCart.bind(this));
    return router;
  }

  customer_homepage(req, res) {
    this.customerServices
      .getAllCustomerInfo(customer_id)
      .then((customerName) => {
        // CustomerDisplayProducts(req, res) {
        // console.log("display products", products)
        this.customerServices.getMerchantProducts().then((products) => {
          // console.log("display products", products);
          res.render("customer-homepage", {
            layout: "customerLoggedIn",
            products: products,
            customerName: customerName,
            // console.log(customerName);
            // res.render("customer-homepage", {
            // layout: "customerLoggedIn",
          });
        });
      });
  }

  customer_settings(req, res) {
    console.log("kjasdhfkasdhfksahfdsah");
    this.customerServices.getCustomerInfo(customer_id).then((data) => {
      // console.log("customersettings-info", data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }
  getAllCustomerData(req, res) {
    this.customerServices.getAllCustomerInfo(customer_id).then((data) => {
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }
  //edit customer info
  editUsername(req, res) {
    let newInfo = req.body.username;
    this.customerServices
      .editCustomerUsername(customer_id, newInfo)
      .then(() => {
        res.redirect("customer-settings");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
  editAddress(req, res) {
    let NewBuildingName = req.body.buildingAddress;
    let NewStreetName = req.body.streetAddress;
    let NewCountryName = req.body.countryAddress;
    this.customerServices
      .editCustomerAddress(
        customer_id,
        NewBuildingName,
        NewStreetName,
        NewCountryName
      )
      .then(() => {
        res.redirect("customer-settings");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  post_image(req, res) {
    console.log("req.file", req.file.path);
    let profilePictureURL = JSON.stringify(req.file.path);
    this.customerServices
      .postImage(customer_id, profilePictureURL)
      .then(() => {
        console.log("done");
        res.redirect("/customer-settings");
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
          layout: "customerCart",
          data: data,
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  oneProductPage(req, res) {
    let id = req.params.id;
    this.customerServices.getIndividualProduct(id).then((data) => {
      res.render("customer-product", {
        product: data,
      });
    });
  }

  async postToCart(req, res) {
    let productId = req.params.id;
    console.log("customer_id", customer_id);
    console.log("productId", productId);
    await this.customerServices.addToCart(productId, customer_id);
    res.end();
  }

  async updateCart(req, res) {
    console.log(req.body);
    res.end();
  }
}

module.exports = CustomerRouter;
