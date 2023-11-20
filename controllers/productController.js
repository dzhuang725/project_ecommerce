const Product = require("../models/Product");

const getProducts = async (req, res) => {
  const perPage = 9; // Number of products per page
  const page = parseInt(req.query.page) || 1; // Current page

  const brandFilter = req.query.brand
    ? { brand: { $in: req.query.brand } }
    : {};
  const typeFilter = req.query.type ? { type: { $in: req.query.type } } : {};

  try {
    const products = await Product.find({ ...brandFilter, ...typeFilter })
      .skip(perPage * page - perPage)
      .limit(perPage);

    const count = await Product.countDocuments({
      ...brandFilter,
      ...typeFilter,
    });

    if (count === 0) {
      return res.render("noProductsFound"); // Render a view for no products found
    }

    res.render("home", {
      title: "Ecommerce app",
      isLoggedIn: req.isAuthenticated,
      products: products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / perPage),
      hasNextPage: perPage * page < count,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts };
