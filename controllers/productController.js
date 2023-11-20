const Product = require("../models/Product");

const productsView = (req, res) => {
  res.render("productGallery", {});
};
const getProducts = async (req, res) => {
  const perPage = 9; // Number of products per page
  const page = parseInt(req.query.page) || 1; // Current page

  try {
    const products = await Product.find()
      .skip(perPage * page - perPage)
      .limit(perPage);
    const count = await Product.countDocuments(); // Total number of products

    res.render("productGallery", {
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
