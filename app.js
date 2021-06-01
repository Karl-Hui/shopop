require("dotenv").config();

const passportFunctions = require("./passport");
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

app.use(passportFunctions.initialize());
app.use(passportFunctions.session());

app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  console.log("++++++++++++++++++++++", req.file);
  res.send("Hello World");
});

// Sign up for customers
app.post(
  "/customer-signup",
  passportFunctions.authenticate("local-customerSignup", {
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
  passportFunctions.authenticate("local-customerLogin", {
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
  passportFunctions.authenticate("local-merchantSignup", {
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
  passportFunctions.authenticate("local-merchantLogin", {
    successRedirect: "/",
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
