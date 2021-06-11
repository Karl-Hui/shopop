const FacebookStrategy = require("passport-facebook").Strategy;
const development = require("../knexfile").development;
const knex = require("knex")(development);

require("dotenv").config();


const facebook = (new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback",
        profileFields: ['id', 'displayName', 'email']
    },
    async function (accessToken, refreshToken, profile, done) {
        console.log("profile", profile.emails[0].value, )
        try {
            let user = await knex("customer").where({
                facebook_id: profile.id
            })
            if (user == 0) {
                let newUser = {
                    email: profile.emails[0].value,
                    facebook_id: profile.id,
                    username: profile.displayName
                }
                let userId = await knex("customer").insert(newUser).returning("id")
                newUser.id = userId[0]
                // done is the callback
                done(null, newUser);
            } else {
                done(null, user[0])
            }

        } catch (err) {
            console.log("err", err)
        }
    }
))

module.exports = {
    facebook
}