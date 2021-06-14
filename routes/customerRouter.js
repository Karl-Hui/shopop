const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({
  storage,
});
let customer_id;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.username) {
      customer_id = req.user.id;
      return next();
    }
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
    router.put("/customer-setting", isLoggedIn, this.editAddress.bind(this));
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
        this.customerServices.getMerchantNameAndProducts().then((products) => {
          res.render("customer-homepage", {
            layout: "customerLoggedIn",
            products: products,
            customerName: customerName,
          });
        });
      });
  }

  customer_settings(req, res) {
    this.customerServices.getCustomerInfo(customer_id).then((data) => {
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }
  customer_cart_navBar(req, res) {
    this.customerServices.getCustomerInfo(customer_id).then((data) => {
      res.render("CustomerCart", {
        layout: "cart",
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
        // res.redirect("customer-settings");
        res.send(newInfo);
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
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }

  post_image(req, res) {
    let profilePictureURL = JSON.stringify(req.file.path);
    this.customerServices
      .postImage(customer_id, profilePictureURL)
      .then(() => {
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
        let totalShippingPrice = 0;
        for (let x of data) {
          totalShippingPrice =
            x.shippingPrice * x.purchaseQuantity + totalShippingPrice;
        }
        // console.log("total shipping", totalShippingPrice);
        res.render("cart", {
          layout: "customerCart",
          data: data,
          totalShippingPrice: totalShippingPrice,
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
    await this.customerServices.addToCart(productId, customer_id);
    res.end();
  }

  async updateCart(req, res) {
    let cartItems = req.body;
    await this.customerServices.clearCart(customer_id);
    if (Object.keys(req.body).length > 0) {
      for (const productId in cartItems) {
        await this.customerServices.simpleAddToCart(
          productId,
          cartItems[productId],
          customer_id
        );
      }
    }
    res.end();
  }
}

module.exports = CustomerRouter;
