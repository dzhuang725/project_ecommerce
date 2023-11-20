const Product = require("../models/Product");
const User = require("../models/User");

const getProducts = async (req, res) => {
  const perPage = 9; // Number of products per page
  const page = parseInt(req.query.page) || 1; // Current page

  const brandFilter = req.query.brand
    ? { brand: { $in: req.query.brand } }
    : {};
  const typeFilter = req.query.type
    ? { category: { $in: req.query.type } }
    : {};

  try {
    const products = await Product.find({ ...brandFilter, ...typeFilter })
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Product.countDocuments({
      ...brandFilter,
      ...typeFilter,
    });

    // Get favorite list
    var userWithFavorites = [];
    if (req.isAuthenticated) {
      userWithFavorites = await User.findById(req.user.userId)
        .populate("favorites") // Populate the favorites array with product data
        .exec();
    }

    // Render a view for no products found
    if (count === 0) {
      return res.render("noProductsFound", {
        isLoggedIn: req.isAuthenticated,
        userWithFavorites: userWithFavorites,
      });
    }
    res.render("home", {
      title: "Ecommerce app",
      isLoggedIn: req.isAuthenticated,
      products: products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / perPage),
      hasNextPage: perPage * page < count,
      hasPrevPage: page > 1,
      userWithFavorites: userWithFavorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductDetails = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).render("productNotFound"); // Render a 'product not found' view
    }

    res.render("productDetails", { product: product }); // Render a view with the product details
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).render("productNotFound");
    }
    res.status(500).send("Server error");
  }
};

module.exports = { getProducts, getProductDetails };
