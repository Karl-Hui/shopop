require("dotenv").config();

const passportMerchant = require("./passport_merchant");
const passportCustomer = require("./passport_customer");
const cookieParser = require("cookie-parser");
const database = require("./knexfile").development;
const knex = require("knex")(database);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//imported files
const CustomerRouters = require("./routes/customerRouter");
const CustomerServices = require("./services/customerServices");

let customerService = new CustomerServices(knex);
let customerRoute = new CustomerRouters(customerService);

// merchant import files
const MerchantRouters = require("./routes/merchantRouter");
const MerchantService = require("./services/merchantService");

let merchantService = new MerchantService(knex);
let merchantRoute = new MerchantRouters(merchantService);

const express = require("express"),
  session = require("express-session"),
  handlebars = require("express-handlebars");

const app = express();
// middleware
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(__dirname + "/public"));

app.engine(
  "handlebars",
  handlebars({
    defaultLayout: "main",
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// merchant
app.use(passportMerchant.initialize());
app.use(passportMerchant.session());

// customers
// app.use(passportCustomer.initialize());
// app.use(passportCustomer.session());

app.set("view engine", "handlebars");

// Stripe route
app.use("/merchant/stripe", require("./routes/stripe_route/stripe"));

app.get("/", (req, res) => {
  // console.log("++++++++++++++++++++++", req.file);
  res.send("Hello World");
});

// Sign up for customers
app.post(
  "/customer-signup",
  upload.single("customerImage"),
  passportCustomer.authenticate("local-customerSignup", {
    successRedirect: "/customer-login",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/customer-signup", (req, res) => {
  res.render("user-signup");
});

app.get("/customer-login", (req, res) => {
  res.render("customer-login");
});


app.get("/merchant-signup", (req, res) => {
  res.render("merchant-signup");
});

app.post(
  "/customer-login",
  passportCustomer.authenticate("local-customerLogin", {
    successRedirect: "/customer-homepage",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

// merchant signup
app.post(
  "/merchant-signup",
  passportMerchant.authenticate("local-merchantSignup", {
    successRedirect: "/stripe-form",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/stripe-form", (req, res) => {
  res.render("stripe-form");
});

app.get("/merchant-signup", (req, res) => {
  res.render("merchant-signup");
});

app.get("/merchant-login", (req, res) => {
  res.render("merchant-login");
});

app.post(
  "/merchant-login",
  passportMerchant.authenticate("local-merchantLogin", {
    successRedirect: "/shop/merchant-homepage",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/select", (req, res) => {
  res.render("select");
});

// logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/customer-signup");
});

app.use("/", customerRoute.router());
app.use("/shop", merchantRoute.router());
//user homepage
app.get("/CustomerHomepage", (req, res) => {
  res.render("customer-homepage");
});

// Exporting module to server js
module.exports = app;
