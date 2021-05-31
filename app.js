require("dotenv").config();

const passportFunctions = require("./passport");
const cookieParser = require("cookie-parser");
const database = require("./knexfile").development;
const knex = require("knex")(database);

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
  res.send("Hello World");
});

// Sign up
app.post(
  "/customer-signup",
  passportFunctions.authenticate("local-customerSignup", {
    successRedirect: "/login",
    failureRedirect: "/error",
    cookie: {
      secure: true,
    },
  })
);

app.get("/customer-signup", (req, res) => {
  res.render("user-signup");
});

// Exporting module to server js
module.exports = app;
