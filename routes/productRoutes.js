const Product = require("../models/product");
const Category = require("../models/category");
const express = require("express");
const router = express.Router();

// GET LIST OF PRODUCTS
router.get("/", async (req, res) => {
  // .select is for create the mini serializer
  const productList = await Product.find().select("_id name image");
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

// GET A PRODUCT DETAILS
router.get("/:id", async (req, res) => {
  // .populate is for show the category serializer intead of the ID
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) res.status(404).json({ success: false, message: "Not found" });
  res.status(200).send(product);
});

module.exports = router;
