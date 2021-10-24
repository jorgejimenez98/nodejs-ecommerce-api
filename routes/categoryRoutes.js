const Category = require("../models/category");
const express = require("express");
const router = express.Router();

// GET LIST
router.get(`/`, async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) res.status(500).json({ success: false });
  res.status(200).send(categoryList);
});

// ADD CATEGORY
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

// DELETE CATEGORY
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  Category.findByIdAndRemove(id)
    .then((delCat) => {
      if (delCat)
        return res
          .status(200)
          .json({ success: true, message: "Category Deleted" });
      else {
        return res
          .status(404)
          .json({ success: false, message: "Category not Found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: error });
    });
});

// GET A CATEGORY DETAILS
router.get("/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) res.status(404).json({ success: false, message: "Not found" });
  res.status(200).send(category);
});

// UPDATE CATEGORY
router.put("/:id", async (req, res) => {
  const data = JSON.parse(req.body);
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: data.name,
      icon: data.icon,
      color: data.color,
    },
    { new: true } // Return new values
  );
  if (!category) res.status(404).send("Category not Updated");
  res.status(200).send(category);
});

module.exports = router;
