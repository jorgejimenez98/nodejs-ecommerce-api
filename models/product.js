const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  richDescription: { type: String, default: "" },
  image: { type: String, default: "" },
  images: [{ type: String }],
  brand: { type: String, default: "" },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  countInStock: { type: Number, required: true },
  rating: { type: Number, required: true, min: 0, max: 255 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now },
});

Product = mongoose.model("Product", productSchema);

module.exports = Product;
