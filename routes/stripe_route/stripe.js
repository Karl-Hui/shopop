'use strict';

require("dotenv").config({
  path: "../.env"
});
const stripe = require('stripe')(process.env.STRIPE_KEY);
const request = require('request-promise-native');
const querystring = require('querystring');
const express = require('express');
const database = require("../../knexfile").development;
const knex = require("knex")(database);
const stripeRouter = express.Router();

let merchant_id;

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
      throw (expressAuthorized.error);
    }

    // Update the model and store the Stripe account ID in the datastore:
    // this Stripe account ID will be used to issue payouts to the pilot
    req.user.stripeAccountId = expressAuthorized.stripe_user_id;
    console.log("req.user is this:", req.user)
    let stripeId = req.user.stripeAccountId
    await knex("merchant")
      .update("stripeAccountId", stripeId)
      .where({
        id: req.user.id
      }).then(() => {
        console.log("inserted:", stripeId)
      })

    // Redirect to the merchant home page
    res.redirect('/shop/merchant-homepage');
  } catch (err) {
    console.log('The Stripe onboarding process has not succeeded.');
    next(err);
  }
});

/**
 * GET /pilots/stripe/dashboard
 *
 * Redirect to the shop's Stripe Express dashboard to view payouts and edit account details.
 */
stripeRouter.get('/dashboard', isLoggedIn, async (req, res) => {
  // Make sure the logged-in shop completed the Express onboarding
  // http://localhost:8080/merchant/stripe/dashboard
  console.log("Hello", req.user)
  let merchant = req.user
  // console.log("this is stripe", stripe)
  if (!merchant.stripeAccountId) {
    res.render("/merchant-signup")
  }
  try {
    // Generate a unique login link for the associated Stripe account to access their Express dashboard
    const loginLink = await stripe.accounts.createLoginLink(
      merchant.stripeAccountId, {
        redirect_url: process.env.publicDomain + '/shop/dashboard'
      }
    );

    // Directly link to the account tab
    if (req.query.account) {
      loginLink.url = loginLink.url + '#/account';
    }

    // Retrieve the URL from the response and redirect the user to Stripe
    return res.redirect(loginLink.url);
  } catch (err) {
    console.log(err);
    console.log('Failed to create a Stripe login link.');
    return res.redirect('/merchant-signup');
  }

});

stripeRouter.post('/payment', isLoggedIn, async (req, res, next) => {
  let shop = req.user

  // const paymentIntent = await stripe.paymentIntents.create({
  //   payment_method_types: ['card'],
  //   amount: 1000,
  //   currency: 'usd',
  // }, {
  //   stripeAccount: shop.stripeAccountId,
  // });
  // console.log("================", paymentIntent)
  // let charge = await stripe.charges.create({
  //   amount: 100,
  //   currency: hkd,
  //   // The `transfer_group` parameter must be a unique id for the ride; it must also match between the charge and transfer
  //   transfer_group: {ORDER10}
  // });
  // const transfer = await stripe.transfers.create({
  //   amount: 100,
  //   currency: 'usd',
  //   destination: shop.stripeAccountId,
  //   transfer_group: {ORDER10}
  // })

  // const paymentIntent = await stripe.paymentIntents.create({
  //   payment_method_types: ['card'],
  //   amount: 1000,
  //   currency: 'hkd',
  //   transfer_data: {
  //     destination: shop.stripeAccountId,
  //   },
  // });

  // ============
  const charge = await stripe.charges.create({
    amount: 50000,
    currency: 'hkd',
    source: 'tok_visa',
    on_behalf_of: shop.stripeAccountId,
    transfer_group: '{ORDER10}',
  });

  // Create a Transfer to the connected account (later):
  const transfer = await stripe.transfers.create({
    amount: 6000,
    currency: 'hkd',
    destination: shop.stripeAccountId,
    transfer_group: '{ORDER10}',
  });

  // ========
//   const paymentIntent = await stripe.paymentIntents.create({
//     payment_method_types: ['card'],
//     amount: 50000,
//     currency: 'hkd',
//     // The destination parameter directs the transfer of funds from platform to pilot
//     transfer_data: {
//       // Send the amount for the pilot after collecting a 20% platform fee:
//       // the `amountForPilot` method simply computes `ride.amount * 0.8`
//       amount: 5000,
//       // The destination of this Payment Intent is the pilot's Stripe account
//       destination: shop.stripeAccountId,
//     },
// });
// console.log(paymentIntent)
})



module.exports = stripeRouter;