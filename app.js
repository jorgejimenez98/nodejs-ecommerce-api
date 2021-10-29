const express = require("express");
const app = express();

// Dependencies
require("dotenv/config");
require("./db");
const cors = require("cors");

// Helpers
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/errorhandler");

// Middlerware Settings
app.use(require("morgan")("tiny")); // Log API method details
app.use(express.json()); // Read data from frontend
app.use(cors());
app.options("*", cors());
app.use(authJWT()); // Protect API Authentication
app.use(errorHandler);
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// ADD ROUTES TO APP
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const port = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("APP working"));
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
