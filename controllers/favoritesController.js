const User = require("../models/User");
const Product = require("../models/Product");

const addFavorite = async (req, res) => {
  const productId = req.body.productId;
  const userId = req.user.userId; // Assumed to be available via authentication middleware
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { favorites: productId },
    });
    res.redirect("back"); // Redirect back to the page where the request was made
  } catch (error) {
    res.status(500).send("Error adding to favorites");
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
