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
  res.redirect("/login");
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

    router.get(
      "/customer-settings",
      isLoggedIn,
      this.editPic.bind(this)
    )
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
      "/customer-homepage",
      isLoggedIn,
      upload.single("customer-image"),
      this.post_image.bind(this)
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
  customer_settings(req, res) {
    console.log("kjasdhfkasdhfksahfdsah")
    this.customerServices.getCustomerInfo(customer_id).then((data) => {
      console.log("customersettings-info",data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    });
  }

  getAllCustomerData(req,res) {
    console.log("this is all the cusomters data")
    this.customerServices.getAllCustomerInfo(customer_id).then((data) => {
      console.log("data for customer settings", data);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        data: data,
      });
    })
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
    console.log("asddddddddddddddddddddddddddddddd",req.body);
    console.log("new address",NewBuildingName, NewStreetName, NewCountryName );
    this.customerServices.editCustomerAddress(customer_id,NewBuildingName,NewStreetName,NewCountryName)
    .then(()=> {
      res.redirect("customer-settings")
    })
    .catch((err) => {
      console.log("err", err);
    });
  }

  
  editPic(req,res){
    console.log("changing customer pic")
    this.customerServices.getCustomerProfilePicture(customerId)
    .then((pic) => {
      console.log("pic data", pic);
      res.render("customer-settings-info", {
        layout: "customer-settings",
        pic: pic,
      })
    })
    .catch((err) => {
      console.log("err", err);
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
}

module.exports = CustomerRouter;
