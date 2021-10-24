const Product = require("../models/product");
const Category = require("../models/category");
const express = require("express");
const router = express.Router();

// GET LIST OF PRODUCTS
router.get("/", async (req, res) => {
  const productList = await Product.find();
  if (!productList) res.status(500).json({ success: false });
  res.send(productList);
});

// CREATE PRODUCT
router.post("/", async (req, res) => {
  // Validate Category
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // CREATE Product
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });

  // RETURN created product
  product = await product.save();
  if (!product) return res.status(400).send("Product not created");
  return res.status(201).send(product);
});

module.exports = router;
