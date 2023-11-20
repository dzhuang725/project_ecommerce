const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const database = process.env.MONGO_URI;

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", ProductSchema);

const brands = ["Brand A", "Brand B", "Brand C", "Brand D", "Brand E"];
const categories = ["Electronics", "Clothing", "Home Appliances"];
const products = [];

mongoose
  .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected");
    // Save products to the database
    insertProducts();
  })
  .catch((err) => console.error("MongoDB Connection Error:", err));

async function insertProducts() {
  // Generate products
  brands.forEach((brand) => {
    categories.forEach((category) => {
      for (let i = 0; i < 2; i++) {
        const product = new Product({
          name: `${brand} ${category} Product ${i + 1}`,
          price: Math.floor(Math.random() * 1000) + 100, // Random price between 100 and 1100
          description: `Description for ${brand} ${category} Product ${i + 1}`,
          brand: brand,
          category: category,
          imageUrl: "https://placehold.co/300x200",
        });
        products.push(product);
      }
    });
  });
  try {
    for (const product of products) {
      await product.save();
      console.log(`${product.name} saved to the database.`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
}
