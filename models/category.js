const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true },
  color: { type: String },
  icon: { type: String },
  image: { type: String },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
