require("dotenv").config();

const passportMerchant = require("./passport_merchant");
const passportCustomer = require("./passport_customer");
const cookieParser = require("cookie-parser");
const database = require("./knexfile").development;
const knex = require("knex")(database);

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
app.use(passportCustomer.initialize());
app.use(passportCustomer.session());

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  console.log("++++++++++++++++++++++", req.file);
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
    successRedirect: "/",
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
    successRedirect: "/merchant-login",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/merchant-signup", (req, res) => {
  res.render("merchant-signup");
});

app.get("/merchant-login", (req, res) => {
  res.render("merchant-login");
});

app.post(
  "/merchant-login",
  passportMerchant.authenticate("local-merchantLogin", {
    successRedirect: "/merchant-signup",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/select", (req, res) => {
  res.render("select");
});

// Exporting module to server js
module.exports = app;
