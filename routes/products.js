var express = require("express");
var router = express.Router();
const productController = require("../controllers/productController");
const favoritesController = require("../controllers/favouritesController");
const isAuthenticated = require("../middleware/isAuthenticated");

router.get("/", isAuthenticated, productController.getProducts);
router.get("/products*", isAuthenticated, productController.getProducts);
router.get("/favorites", isAuthenticated, favoritesController.getFavorites);

router.post(
  "/favorites/add/:productId",
  isAuthenticated,
  favoritesController.addFavorite
);

router.delete(
  "/favorites/remove/:productId",
  isAuthenticated,
  favoritesController.removeFavorite
);

module.exports = router;
