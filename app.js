const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(5000, () => {
  console.log("The server is running on http://localhost:5000");
});
