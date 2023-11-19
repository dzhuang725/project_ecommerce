const express = require("express");
const app = express();
app.set("view engine", "ejs");

// BodyParsing
// app.use(express.urlencoded({ extended: false }));

// Database
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGO_URI;
mongoose
  .connect(database, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("db has connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", require("./routes/login"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log("Server has started on port: " + PORT));
