var express = require("express");
var router = express.Router();
const isAuthenticated = require("../middleware/isAuthenticated");

// GET home page
router.get("/", isAuthenticated, (req, res) => {
  res.render("home", {
    title: "Ecommerce app",
    isLoggedIn: req.isAuthenticated,
  });
});

module.exports = router;
