const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: "New York",
  },
  data: {
    type: Date,
    default: Date.now,
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
