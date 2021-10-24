const express = require("express");
const app = express();

// Dependencies
require("dotenv/config");
require("./db");
const cors = require("cors");

// Helpers
const authJWT = require("./helpers/jwt");
const errorHandler = require("./helpers/errorhandler");

//Routes Imports
const productsRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middlerware Settings
app.use(require("morgan")("tiny")); // Log API method details
app.use(express.json()); // Read data from frontend
app.use(cors());
app.options("*", cors());
app.use(authJWT()); // Protect API Authentication
app.use(errorHandler);

// ADD ROUTES TO APP
app.use("/api/users", userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("APP working"));
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
