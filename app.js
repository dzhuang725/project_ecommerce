const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
var homeRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var productRouter = require("./routes/products");

// Database
const database = process.env.MONGO_URI;
mongoose
  .connect(database, {})
  .then(() => console.log("db has connected"))
  .catch((err) => console.log(err));

// View Engine
// Registering helpers
hbs.registerHelper("increment", function (value, options) {
  return parseInt(value) + 1;
});

hbs.registerHelper("decrement", function (value, options) {
  return parseInt(value) - 1;
});
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
const partialsPath = path.join(__dirname, "/views/partials");
hbs.registerPartials(partialsPath);

// BodyParsing
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
// app.use("/", homeRouter);
app.use("/", loginRouter);
app.use("/", logoutRouter);
app.use("/", productRouter);
app.use(express.static(__dirname + "/public"));

module.exports = app;
