const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
// var homeRouter = require("./routes/index");
var loginRouter = require("./routes/login");
var logoutRouter = require("./routes/logout");
var productRouter = require("./routes/products");
var adminRouter = require("./routes/admin");
var redirectRouter = require("./routes/redirect");

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
app.use("/", adminRouter);
app.use(express.static(__dirname + "/public"));
app.use("/", redirectRouter);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).render("error", { error: message });
});

module.exports = app;
