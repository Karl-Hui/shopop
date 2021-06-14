"use strict";

require("dotenv").config({
  path: "../.env",
});
const stripe = require("stripe")(process.env.STRIPE_KEY);
const request = require("request-promise-native");
const querystring = require("querystring");
const express = require("express");
const database = require("../../knexfile").development;
const knex = require("knex")(database);
const stripeRouter = express.Router();

let merchant_id;
let something;
// middleware to check if login
function isLoggedIn(req, res, next) {
  merchant_id = req.user.id;
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  next();
}

/**
 * GET /pilots/stripe/authorize
 *
 * Redirect to Stripe to set up payments.
 */

stripeRouter.get("/authorize", isLoggedIn, (req, res) => {
  req.session.state = Math.random().toString(36).slice(2);
  // Define the mandatory Stripe parameters: make sure to include our platform's client ID
  let parameters = {
    client_id: process.env.clientId,
    state: req.session.state,
  };

  parameters = Object.assign(parameters, {
    redirect_uri: process.env.publicDomain + "/merchant/stripe/token",
  });

  console.log("Starting Express flow:", parameters);
  res.redirect(
    process.env.authorizeUri + "?" + querystring.stringify(parameters)
  );
});

stripeRouter.get("/token", isLoggedIn, async (req, res, next) => {
  // console.log("asdkjbasjkdbasjdbkjasdbkasjd")
  // Check the `state` we got back equals the one we generated before proceeding (to protect from CSRF)
  if (req.session.state != req.query.state) {
    return res.redirect("/login");
  }
  try {
    // Post the authorization code to Stripe to complete the Express onboarding flow
    const expressAuthorized = await request.post({
      uri: process.env.tokenUri,
      form: {
        grant_type: "authorization_code",
        client_id: process.env.clientId,
        client_secret: process.env.STRIPE_KEY,
        code: req.query.code,
      },
      json: true,
    });

    if (expressAuthorized.error) {
      throw expressAuthorized.error;
    }

    // Update the model and store the Stripe account ID in the datastore:
    // this Stripe account ID will be used to issue payouts to the pilot
    req.user.stripeAccountId = expressAuthorized.stripe_user_id;
    console.log("req.user is this:", req.user);
    let stripeId = req.user.stripeAccountId;
    await knex("merchant")
      .update("stripeAccountId", stripeId)
      .where({
        id: req.user.id,
      })
      .then(() => {
        console.log("inserted:", stripeId);
      });

    // Redirect to the merchant home page
    res.redirect("/shop/merchant-homepage");
  } catch (err) {
    console.log("The Stripe onboarding process has not succeeded.");
    next(err);
  }
});

stripeRouter.post("/payout", isLoggedIn, async (req, res) => {
  let merchant = req.user;
  try {
    // get available balance in shop account
    const balance = await stripe.balance.retrieve({
      stripeAccount: merchant.stripeAccountId,
    });
    // destructure values in the object and apply it to amount and currency
    const { amount, currency } = balance.available[0];

    console.log("Current Balance in merchant's account is: ", amount, currency);
    // console.log("this is the balance in payout route", balance)
    const payout = await stripe.payouts.create(
      {
        amount: amount,
        currency: currency,
        statement_descriptor: process.env.appname,
      },
      {
        stripeAccount: merchant.stripeAccountId,
      }
    );
    res.redirect("/shop/dashboard");
  } catch (error) {}
});

/**
 * GET /pilots/stripe/dashboard
 *
 * Redirect to the shop's Stripe Express dashboard to view payouts and edit account details.
 */
stripeRouter.get("/dashboard", isLoggedIn, async (req, res) => {
  // Make sure the logged-in shop completed the Express onboarding
  // http://localhost:8080/merchant/stripe/dashboard
  console.log("Hello", req.user);
  let merchant = req.user;
  // console.log("this is stripe", stripe)
  if (!merchant.stripeAccountId) {
    res.render("/merchant-signup");
  }
  try {
    // Generate a unique login link for the associated Stripe account to access their Express dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      merchant.stripeAccountId,
      {
        redirect_url: process.env.publicDomain + "/shop/dashboard",
      }
    );

    // Directly link to the account tab
    if (req.query.account) {
      loginLink.url = loginLink.url + "#/account";
    }

    // Retrieve the URL from the response and redirect the user to Stripe
    return res.redirect(loginLink.url);
  } catch (err) {
    console.log(err);
    console.log("Failed to create a Stripe login link.");
    return res.redirect("/merchant-signup");
  }
});

stripeRouter.post("/payment", isLoggedIn, async (req, res, next) => {
  console.log("========== payment =============");
  let cartInfo = await knex
    .select()
    .from("checkout_cart")
    .join("product_info", "product_info.id", "checkout_cart.product_info_id")
    .where({
      customer_info: req.user.id,
    });

  let merchantInfo = await knex("merchant").select().where({
    id: cartInfo[0].merchant_id,
  });
  // get merchant stripe id
  let merchantStripeAccountId = merchantInfo[0].stripeAccountId;
  // total amount = total product + total shipping
  let productTotal = 0;
  for (let eachItem of cartInfo) {
    productTotal =
      parseInt(eachItem.price) * parseInt(eachItem.purchaseQuantity) +
      productTotal +
      parseInt(eachItem.shippingPrice);
  }
  let finalCheckOut = productTotal * 100;
  // console.log("productTotal", finalCheckOut)
  // console.log("this is product total", productTotal)
  // console.log("merchantstripe", merchantStripeAccountId)
  // console.log("cartInfo", cartInfo)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalCheckOut,
    currency: "hkd",
  });

  const transfer = await stripe.transfers.create({
    amount: finalCheckOut * 0.8,
    currency: "hkd",
    destination: merchantStripeAccountId,
  });
  something = paymentIntent.id;

  const intent = await stripe.paymentIntents.retrieve(something);
  const charges = intent.charges.data;
  // if (intent.status === 'succeeded') {
  //   console.log("succeeded")
  // }
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

stripeRouter.post("/checkInfo", async (req, res, next) => {
  const intent = await stripe.paymentIntents.retrieve(something);
  const charges = intent.charges.data;
  if (intent.status === "succeeded") {
    console.log("succeeded");
    let cartInfo = await knex
      .select()
      .from("checkout_cart")
      .join("product_info", "product_info.id", "checkout_cart.product_info_id")
      .where({
        customer_info: req.user.id,
      });
    // looping through each item inside the cart and updating the stock to minus one
    // adding sold item into purchases table
    for (let eachItem of cartInfo) {
      // console.log("after each purchase", eachItem)
      let newStock = 0;
      newStock = eachItem.stock - eachItem.purchaseQuantity;
      await knex("product_info")
        .select()
        .where({
          id: eachItem.product_info_id,
        })
        .update({
          stock: newStock,
        });
      // adding sold item into purchases table
      let soldProduct = {
        customer_id: eachItem.customer_info,
        product_info_id: eachItem.product_info_id,
        merchant_id: eachItem.merchant_id,
      };
      // console.log("what is sold product?", soldProduct)
      await knex("purchases").insert(soldProduct);
    }
  }
});

module.exports = stripeRouter;
