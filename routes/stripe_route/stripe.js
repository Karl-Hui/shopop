'use strict';

require("dotenv").config({ path: "../.env" });
const stripe = require('stripe')(process.env.STRIPE_KEY);
const request = require('request-promise-native');
const querystring = require('querystring');
const express = require('express');
const database = require("../../knexfile").development;
const knex = require("knex")(database);
const stripeRouter = express.Router();


// middleware to check if login
function isLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    // console.log(req.user.id)
    // console.log("logged in as id:", req.user.id);
    return res.redirect("/login");
  }
  next();
}

/**
 * GET /pilots/stripe/authorize
 *
 * Redirect to Stripe to set up payments.
 */

stripeRouter.get("/authorize", isLoggedIn, (req,res) => {
  req.session.state = Math.random()
  .toString(36)
  .slice(2);
  // Define the mandatory Stripe parameters: make sure to include our platform's client ID
  let parameters = {
    client_id: process.env.clientId,
    state: req.session.state,
  };

  parameters = Object.assign(parameters, {
    redirect_uri: process.env.publicDomain + '/merchant/stripe/token',
  });

  console.log('Starting Express flow:', parameters);
  res.redirect(
    process.env.authorizeUri + '?' + querystring.stringify(parameters)
  );
})

stripeRouter.get('/token', isLoggedIn, async (req, res, next) => {
  // console.log("asdkjbasjkdbasjdbkjasdbkasjd")
  // Check the `state` we got back equals the one we generated before proceeding (to protect from CSRF)
  if (req.session.state != req.query.state) {
    return res.redirect('/login');
  }
  try {
    // Post the authorization code to Stripe to complete the Express onboarding flow
    const expressAuthorized = await request.post({
      uri: process.env.tokenUri, 
      form: { 
        grant_type: 'authorization_code',
        client_id: process.env.clientId,
        client_secret: process.env.STRIPE_KEY,
        code: req.query.code
      },
      json: true
    });

    if (expressAuthorized.error) {
      throw(expressAuthorized.error);
    }

    // Update the model and store the Stripe account ID in the datastore:
    // this Stripe account ID will be used to issue payouts to the pilot
    req.user.stripeAccountId = expressAuthorized.stripe_user_id;
    console.log("req.user is this:",req.user)
    

    // Redirect to the merchant home page
    res.redirect('/shop/merchant-homepage');
  } catch (err) {
    console.log('The Stripe onboarding process has not succeeded.');
    next(err);
  }
});


module.exports = stripeRouter;