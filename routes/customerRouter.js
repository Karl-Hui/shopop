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

    // router.get(
    //   "/customer-display-products", isLoggedIn, 
    // this.CustomerDisplayProducts.bind(this)
    // );
    
    router.get(
      "/customer-settings",
      isLoggedIn,
      this.getAllCustomerData.bind(this)
    );

    router.put(
      "/customer-settings",
      isLoggedIn,
      this.editUsername.bind(this)
    )
    router.put(
      "/customer-address",
      isLoggedIn,
      this.editAddress.bind(this)
    )

    router.post(
      "/customer-settings",
      isLoggedIn,
      upload.single("customer-image"),
      this.post_image.bind(this)
    );

    router.get("/cart", isLoggedIn, this.checkOutPage.bind(this));

    return router;
  }

  customer_homepage(req, res) {
    this.customerServices.getAllCustomerInfo(customer_id)
    .then((customerName) => {
      // CustomerDisplayProducts(req, res) {
    // console.log("display products", products)
    this.customerServices.getMerchantProducts()
    .then((products) => {
      console.log("display products", products)
      res.render("customer-homepage", {
        layout: "customerLoggedIn",
        products: products,
        customerName: customerName,
      // console.log(customerName);
      // res.render("customer-homepage", {
        // layout: "customerLoggedIn",
        
        
      });
    });
  })
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
    // console.log("this is all the cusomters data");
    this.customerServices.getAllCustomerInfo(customer_id)
    .then((data) => {
      // console.log("data for customer settings", data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }
//edit customer info
  editUsername(req,res) {
    let newInfo = req.body.username;
    // console.log("SADSADASDASDSADSADSAD",newInfo);
    this.customerServices.editCustomerUsername(customer_id,newInfo)
    .then(() => {
      res.redirect("customer-settings");
    })
    .catch((err) => {
      console.log("err", err);
    });

  }
  editAddress(req,res) {
    let NewBuildingName = req.body.buildingAddress;
    let NewStreetName = req.body.streetAddress;
    let NewCountryName = req.body.countryAddress;
    // console.log("asddddddddddddddddddddddddddddddd",req.body);
    // console.log("new address",NewBuildingName, NewStreetName, NewCountryName );
    this.customerServices.editCustomerAddress(customer_id,NewBuildingName,NewStreetName,NewCountryName)
    .then(()=> {
      res.redirect("customer-settings")
    })
    .catch((err) => {
      console.log("err", err);
    });
  }

  // merchant products data
  // CustomerDisplayProducts(req, res) {
  //   console.log("display products", products)
  //   this.customerServices.getMerchantProducts()
  //   .then((products) => {
  //     console.log("display products", products)
  //     res.render("customer-homepage", {
  //       layout: "customerLoggedIn",
  //       products: products,
  //     })
  //   })
  // }





  post_image(req, res) {
    console.log("req.file", req.file.path);
    let profilePictureURL =JSON.stringify( req.file.path);
    this.customerServices
      .postImage(customer_id, profilePictureURL)
      .then(() => {
        console.log("done");
        res.redirect("/customer-settings")
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
          layout: "customerLoggedIn",
          data: data,
        });
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

module.exports = CustomerRouter;
