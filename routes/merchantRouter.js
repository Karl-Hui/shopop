const express = require("express");
const stripe = require('stripe')(process.env.STRIPE_KEY);
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
  res.redirect("/merchant-login");
}

class MerchantRouter {
  constructor(merchantService) {
    this.merchantService = merchantService;
  }

  router() {
    const router = express.Router();
    router.get("/merchant-homepage", isLoggedIn, this.merchant_homepage.bind(this));
    router.get("/product/:productId", isLoggedIn, this.productPage.bind(this));
    router.get("/dashboard", isLoggedIn, this.dashboard.bind(this));
    router.post("/api/create-product", isLoggedIn, upload.array("productPhoto", 2), this.createProduct.bind(this));
    router.delete("/api/delete/product/:id", isLoggedIn, this.delete.bind(this))

    router.get("/merchant-settings", isLoggedIn, this.merchant_settings.bind(this))
    router.put("/merchant-name", isLoggedIn, this.editMerchantName.bind(this))
    router.put("/merchant-shopDescription", isLoggedIn, this.editMerchantDescription.bind(this))
    router.post(
      "/merchant-settings",
      isLoggedIn,upload.single
      ("merchant-image",1),
      this.postShopImage.bind(this));
    router.post("/api/product/edit/:id", isLoggedIn, upload.array("productPhoto", 2), this.update.bind(this))
    return router;
  }


  async dashboard(req, res) {
    const shop = req.user
    const Balance = await stripe.balance.retrieve({
      stripeAccount: req.user.stripeAccountId,
    });
    let balancePending = await (Balance.available[0].amount / 100).toFixed(2)
    // console.log("amount", balancePending)
    // console.log("user", shop)
    res.render("dashboard", {
      layout: "merchantLoggedIn",
      shop: shop.merchantName,
      balanceAvailable: balancePending
    })
  }
  merchant_homepage(req, res) {
    this.merchantService.getMerchantInfo(merchant_id).then((merchantInfo) => {
      this.merchantService.getMerchantProducts(merchant_id).then((product) => {
        // console.log("merchantInfo", merchantInfo);
        // console.log("this is product:", product)
        res.render("merchant-homepage", {
          layout: "merchantLoggedIn",
          merchantInfo: merchantInfo,
          product: product,
        });
      })
    });
  }

  createProduct(req, res) {
    // console.log("req.file", req.files);
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

  productPage(req, res) {
    let productId = req.params.productId
    // console.log("this is product id", typeof productId)
    // console.log(productId)
    this.merchantService.getMerchantInfo(merchant_id).then((merchantInfo) => {
      this.merchantService.getIndividualProduct(productId, merchant_id).then((product) => {
        // console.log("this is product", product)
        // console.log(merchantInfo)
        res.render("product-page", {
          layout: "merchantLoggedIn",
          merchantInfo: merchantInfo,
          product: product
        })
      })
    })
  }


  delete(req, res) {
    let id = req.params.id
    this.merchantService.deleteProduct(id)
      .then((deletedString) => {
        console.log(deletedString)

      }).then(() => {
        res.redirect("/")
      })
  }

//merchant settings
merchant_settings(req, res) {
  this.merchantService.merchantSettings(merchant_id).then((merchantInfo)  => {
    res.render("merchant-settings-info", {
      layout: "merchant-settings",
      merchantInfo: merchantInfo,
    });
  });
}
editMerchantName(req,res) {
  let newMerchantName = req.body.merchantName;
  // console.log("SADSADASDASDSADSADSAD",newInfo);
  this.merchantService.editMerchantName(merchant_id,newMerchantName)
  .then(() => {
    res.redirect("/shop/merchant-settings");
  })
  .catch((err) => {
    console.log("err", err);
  });

}

editMerchantDescription(req, res) {
  let newShopDescription = req.body.shopDescription;
  this.merchantService.editMerchanDescription(merchant_id, newShopDescription)
  .then(()=>{
    res.redirect("/shop/merchant-settings");
  })
  .catch((err) =>{
    console.log("err", err);
  })
}

postShopImage(req,res) {
  let shopPictureURL =JSON.stringify(req.file.path);
  this.merchantService.postMerchantImage(merchant_id, shopPictureURL)
  .then(()=> {
    console.log("done")
    res.redirect("/shop/merchant-settings")
  })
  .catch((err) =>{
    console.log("err", err);
  })
}

  update(req, res) {
    let id = req.params.id
    let productName = req.body.productName;
    let productPhoto = [];
    for (let i of req.files) {
      productPhoto.push(i.path)
    }
    let price = req.body.price;
    let productDescription = req.body.productDescription;
    let stock = req.body.stock;
    let shippingPrice = req.body.shippingPrice;
    let Size = req.body.Size;
    let productCategory = req.body.productCategory;
    let productCondition = req.body.productCondition;
    let productStatus = "unsold"
    // console.log("sup bro", id, productPhoto, productName, productDescription, stock, price, shippingPrice, Size, productCondtion, productCategory, productStatus, merchant_id)
    this.merchantService.updateProduct(id, productPhoto, productName, productDescription, stock, price, shippingPrice, Size, productCondition, productCategory, productStatus, merchant_id)
      .then(() => {
        res.redirect('/shop/merchant-homepage')
        console.log("updated")
      }).catch((error) => {
        console.log(error, "error creating product")
      })
  }

}

module.exports = MerchantRouter;