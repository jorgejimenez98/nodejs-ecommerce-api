const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const morgan = require("morgan");

// Middlerware
app.use(bodyParser.json()); // Read data from frontend
app.use(morgan("tiny")); // Log API method details

require("dotenv/config");
require("./db");

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});
