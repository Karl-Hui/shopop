const express = require("express");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
// let currentCustomer;
let merchant_id;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    merchant_id = req.user.id;
    // console.log(req.user.id)
    console.log("logged in as id:", req.user.id);
    return next();
  }
  res.redirect("/login");
}

class MerchantRouter {
  constructor(merchantService) {
    this.merchantService = merchantService;
  }

  router() {
    const router = express.Router();
    router.get(
      "/merchant-homepage",
      isLoggedIn,
      this.merchant_homepage.bind(this)
    );
    // router.get(
    //   "/api/merchant/:userId/products",this.merchantProducts.bind(this)
    // );

    router.post(
      "/merchant-homepage",
      isLoggedIn,
      upload.single("merchant-image"),
      this.post_image.bind(this)
    );
    return router;
  }

  merchant_homepage(req, res) {
    this.merchantService.getMerchantInfo(merchant_id).then((merchantName) => {
      this.merchantService.getMerchantProducts(merchant_id).then((product) => {
        // console.log(merchantName);
        console.log("asdasdasadsdas",product)
        res.render("merchant-homepage", {
          layout: "merchantLoggedIn",
          merchantName: merchantName,
          product: product
        });
      })
    });
  }
  post_image(req, res) {
    console.log("req.file", req.file);
  }

  // merchantProducts(req,res){
  //   console,log("List products")
  //   let merchantId = req.params.userId;
  //   this.merchantService.getMerchantProducts(merchantId)
  //   .then((products) => {
  //     res.json(products)
  //   })
  // }
}

module.exports = MerchantRouter;
