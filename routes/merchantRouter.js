const express = require("express");
const multer = require("multer");
const {
  storage
} = require("../cloudinary");
const upload = multer({
  storage
});
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
    router.get("/merchant-homepage", isLoggedIn, this.merchant_homepage.bind(this));
    router.get("/merchant-settings", isLoggedIn, this.merchant_settings.bind(this));
    // router.put("/merchant-settings", isLoggedIn, this. editMerchant_username(this));
    router.post("/api/create-product", isLoggedIn, upload.array("productPhoto", 10), this.createProduct.bind(this));
    return router;
  }

  merchant_homepage(req, res) {
    this.merchantService.getMerchantInfo(merchant_id).then((merchantInfo) => {
      this.merchantService.getMerchantProducts(merchant_id).then((product) => {
        // console.log("merchantInfo", merchantInfo);
        console.log("this is product:", product[0])
        res.render("merchant-homepage", {
          layout: "merchantLoggedIn",
          merchantInfo: merchantInfo,
          product: product,
        });
      })
    });
  }

  createProduct(req, res) {
    console.log("req.file", req.files);
    let productName = req.body.productName;
    let productPhoto = [];
    for (let i of req.files) {
      productPhoto.push(i.path)
    }
    let price = req.body.price;
    let productDescription = req.body.productDescription;
    let stock = req.body.stock;
    let shippingPrice = req.body.shippingPrice;
    let Size = req.body.shippingPrice;
    let productCategory = req.body.productCategory;
    let productCondtion = req.body.productCondition;
    let productStatus = "unsold"
    this.merchantService.createProduct(productPhoto, productName, productDescription, stock, price, shippingPrice, Size, productCondtion, productCategory, productStatus, merchant_id)
      .then(() => {
        res.redirect('/shop/merchant-homepage')
      }).catch((error) => {
        console.log(error, "error creating product")
      })
  }
    //merchant settings
    merchant_settings(req, res) {
      this.merchantService.getMerchantInfo(merchant_id)
      .then((merchantInfo) => {
        res.render("merchant-settings-info", {
          layout: "merchant-settings",
          data: merchantInfo,
        });
      });
    }

  // editMerchant_username(req, res) {
  //   let newName = req.body.merchantName;
  //   this.merchantService.editMerchantUsername
  //   (merchant_id,newName)
  //   .then(()=> {
  //     res.redirect("merchant-settings");
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //   });
  // }

  // editMerchant_address(req, res) {
  //   let NewMerchantBuildingName = req.body.buildingAddress;
  //   let NewMerchantStreetName = req.body.streetAddress;
  //   let NewMerchantCountryName = req.body.countryAddress;
  //   this.merchantService.editMerchantAddress
  //   (merchant_id,NewMerchantBuildingName,NewMerchantStreetName,NewMerchantCountryName)
  //   .then(()=> {
  //     res.redirect("merchant-settings")
  //   })
  //   .catch((err)=> {
  //     console.log("err",err)
  //   });
  //}
  

}

module.exports = MerchantRouter;