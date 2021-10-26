const Product = require("../models/product");
const Category = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

// Multer Upload Images Settings
// https://github.com/expressjs/multer

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Image Image Type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${filename}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

// GET LIST OF PRODUCTS
router.get("/", async (req, res) => {
  // Filter Section /api/products?categories=12312,12312
  let filter = {};
  if (req.query.categories) {
    filter = { categories: req.query.categories.split(",") };
  }
  // GET TABLE .select is for create the mini serializer
  const productList = await Product.find(filter).select("_id name image");
  if (!productList) res.status(500).json({ success: false });
  res.send(productList);
});

// CREATE PRODUCT
router.post("/", uploadOptions.single("image"), async (req, res) => {
  // Validate Category
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // File Settings
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  // CREATE Product
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
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
  // Valdate ID
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("Invalid Product ID");
  }
  // .populate is for show the category serializer intead of the ID
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) res.status(404).json({ success: false, message: "Not found" });
  res.status(200).send(product);
});

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  // Valdate ID
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("Invalid Product ID");
  }
  // Validate Category
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  // UPDATE PRODUCT
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
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
    },
    { new: true } // Return new updated values
  ).populate("category");

  // RETURN RESPONSE
  if (!product) res.status(404).send("Category not Updated");
  res.status(200).send(product);
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // Valdate ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send("Invalid Product ID");
  }
  // DELETE PRODUCT
  Product.findByIdAndRemove(id)
    .then((delProduct) => {
      if (delProduct)
        return res
          .status(200)
          .json({ success: true, message: "Product Deleted" });
      else {
        return res
          .status(404)
          .json({ success: false, message: "Product not Found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: error });
    });
});

// GET PRODUCTS COUNT
router.get("/get/count", async (req, res) => {
  const productCount = await Product.countDocuments({});
  if (!productCount) res.status(500).json({ success: false });
  res.status(200).send({ productsCount: productCount });
});

// GET FEATURED PRODUCTS
router.get("/get/featured/:count", async (req, res) => {
  // .limit is to set a max of products
  const count = req.params.count ? req.params.count : 0;
  const productsList = await Product.find({ isFeatured: true }).limit(+count);
  if (!productsList) res.status(500).json({ success: false });
  res.status(200).send(productsList);
});

module.exports = router;
