require("dotenv").config();
// import * as mdb from 'mdb-ui-kit'; // lib
// import { Input } from 'mdb-ui-kit'; // module
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.render("home");
})

app.route("/login")
  .get(function(req, res){
    res.render("login");
  })
  .post(function(req, res) {

  })

app.route("/signup")
  .get(function(req, res){
    res.render("signup");
  })
  .post(function(req, res) {

  })


app.listen(3000, function() {
  console.log("Server started on port 3000")
});
