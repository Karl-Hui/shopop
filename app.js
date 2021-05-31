const express = require("express"),
      session = require('express-session');
const app = express();
const port = 8000
// middleware
app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.get("/", (req,res) => {
    res.send("Hello World")
})

app.listen(port, () => {
    console.log(`🚀 app listening on ${port}`)
})