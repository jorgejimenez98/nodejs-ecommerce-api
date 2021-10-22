const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/nodejs-ecommerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;

db.on("connected", () => {
  console.log("Database connected successfully");
});

db.on("error", () => {
  console.log("Database connection error ");
});

module.exports = mongoose;