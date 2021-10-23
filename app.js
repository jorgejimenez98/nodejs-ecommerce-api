const express = require("express");
const app = express();

// Dependencies
require("dotenv/config");
require("./db");

//Routes Imports
const productsRoutes = require("./routes/productRoutes");

// Middlerware Settings
app.use(require("morgan")("tiny")); // Log API method details
app.use(express.json()); // Read data from frontend
app.use(express.text());

// ADD ROUTES TO APP
app.use("/api/products", productsRoutes);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => res.send("APP working"));
app.listen(port, () => console.log(`Server on http://localhost:${port}`));
