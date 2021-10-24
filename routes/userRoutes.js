const User = require("../models/user");
const express = require("express");
const router = express.Router();

// GET USERS LIST
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("id name email isAdmin");
  if (!userList) res.status(500).json({ success: false });
  res.send(userList);
});

// REGISTER USER
router.post("/", async (req, res) => {
  const data = req.body;
  console.log(data)
  let user = new User({
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    phone: data.phone,
    isAdmin: data.isAdmin,
    apartment: data.apartment,
    zip: data.zip,
    street: data.street,
    city: data.city,
    country: data.country,
  });
  user = await user.save();
  if (!user) res.status(404).send("Error to create user");
  res.send(user);
});

module.exports = router;
