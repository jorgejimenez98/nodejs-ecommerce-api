const Category = require("../models/category");
const express = require("express");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) res.status(500).json({ success: false });
  res.send(categoryList);
});

module.exports = router;

router.post("/", async (req, res) => {
  const data = JSON.parse(req.body);
  let category = new Category({
    name: data.name,
    icon: data.icon,
    color: data.color,
  });
  category = await category.save();
  if (!category) res.status(404).send("Error to create category");
  res.send(category);
});
