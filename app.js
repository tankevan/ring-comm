'use strict';

const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;

const express = require("express");
const app = express();
const stripe = require("stripe")(keySecret);

app.set("view engine", "pug");
app.use(express.static('public'));
app.use(require("body-parser").urlencoded({extended: false}));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.get("/", (req, res) => {
  const title = "SUTD Ring Comm";
  res.render("index.pug", {title});
});

app.get("/order", (req, res) => {
  res.render("order.pug", {keyPublishable});
});

app.post("/charge", (req, res) => {
  let amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: "Sample Charge",
         currency: "usd",
         customer: customer.id
    }))
  .then(charge => res.render("charge.pug"));
});

const PORT = process.env.PORT || 4567;
app.listen(PORT);