var express = require("express");
var router = express.Router();
const productController = require("../controllers/productController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, productController.getProducts);
router.get("/products*", isAuthenticated, productController.getProducts);

module.exports = router;
