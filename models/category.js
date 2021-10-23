const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
