const User = require("../models/User");
const Product = require("../models/Product");

const addFavorite = async (req, res, next) => {
  try {
    if (!req.isLoggedin) {
      const error = new Error("Please login first");
      error.status = "401 Unauthorized";
      throw error;
    }
    const productId = req.body.productId;
    const userId = req.user.userId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { favorites: productId },
    });
    // Redirect back to the page where the request was made
    res.redirect("back");
  } catch (error) {
    const status = error.status || 500;
    error.status = status;
    res.render("error", { message: error.message, error: error });
  }
};

const removeFavorite = async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user.userId;

  try {
    await User.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
    res.redirect("back");
  } catch (error) {
    res.status(500).send("Error removing from favorites");
  }
};

module.exports = { addFavorite, removeFavorite };
