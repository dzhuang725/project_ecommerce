var express = require("express");
var router = express.Router();
const productController = require("../controllers/productController");
const favoritesController = require("../controllers/favoritesController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, productController.getProducts);
router.get(
  "/products/details/:productId",
  isAuthenticated,
  productController.getProductDetails
);
router.get("/products*", isAuthenticated, productController.getProducts);

router.post(
  "/favorites/add/:productId",
  isAuthenticated,
  favoritesController.addFavorite
);

router.post(
  "/favorites/remove/:productId",
  isAuthenticated,
  favoritesController.removeFavorite
);

module.exports = router;
