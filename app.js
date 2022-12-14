require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const mailgun = require("mailgun-js");
// const DOMAIN =
// const mg = mailgun({apiKey: process.env.MAILGUN_APIKEY, domain: DOMAIN});
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const port = 3001;


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(session({
  secret: process.env.SESSION_COOKIESECRET,
  name: process.env.SESSION_COOKIENAME,
  resave: false,
  saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_API, {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: {
    type: String,
    unique: true
  } ,
  password: String
})

const bankAccountSchema = new mongoose.Schema({
  balance: Number,
  route_number: Number,
  account_number: {
    type: Number,
    unique: true
  }
})

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get("/", function(req, res){
  res.render("home");
})

app.get("/profile", function(req, res){
  if (req.user) {
    res.render("profile");
  } else {
    res.redirect("/login");
  }
})


app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res) {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    req.login(user, function(err){
      if (err){
        console.log(err);
      }else{
        passport.authenticate("local")(req,res, function(){
          res.redirect("/profile")
        })
      }
    })
  })

app.route("/register")
  .get(function(req, res){
    res.render("register");
  })
  .post(function(req, res) {
    User.register({first_name: req.body.fname,
                  last_name: req.body.lname,
                  username: req.body.username},
                  req.body.password,
                  function(err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      }
      else {
        console.log("Successful")
        passport.authenticate("local")(req, res, function(){
          res.redirect("/profile");
        })
      }
    })
  });

app.route("/forgot-password")
  .get(function(req, res) {
    res.render("forgotPassword");
  })




app.listen(port, function() {
  console.log("Server started on port", port)
});
