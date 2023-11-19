const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);
const session = require("express-session");
var indexRouter = require("./routes/index");

// Database
const database = process.env.MONGO_URI;
mongoose
  .connect(database, {})
  .then(() => console.log("db has connected"))
  .catch((err) => console.log(err));

// View Engine
app.set("view engine", "hbs");

// BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "oneboy",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", indexRouter);
app.use("/", require("./routes/login"));

module.exports = app;
