require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
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
// app.set("trust proxy", 1)
app.use(session({
  secret: process.env.SESSION_COOKIESECRET,
  name: process.env.SESSION_COOKIENAME,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/raDB', {useNewUrlParser: true})

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String
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
  res.render("profile");
})


app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res) {

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


app.listen(port, function() {
  console.log("Server started on port", port)
});
