const express = require("express"),
      session = require('express-session'),
      handlebars = require('express-handlebars');

const app = express();
// middleware
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'));

app.engine(
    'handlebars',
    handlebars({
        defaultLayout: 'main'
    })
);

app.set('view engine', 'handlebars');


app.get("/", (req,res) => {
    res.send("Hello World")
})

// Sign up 
// app.post(
//     '/customer-signup',
//     passportFunctions.authenticate('local-signup', {
//         successRedirect: '/login',
//         failureRedirect: '/error',
//         cookie: {
//             secure: true
//         }
//     })
// );

app.get('/customer-signup', (req, res) => {
    res.render('user-signup')
})

// Exporting module to server js
module.exports = app;