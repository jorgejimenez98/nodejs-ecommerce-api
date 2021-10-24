const User = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// LOGIN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Find A user with provided email
  const user = await User.findOne({ email: email });
  // Check if user exist
  if (!user) res.status(404).send("User not found");
  // Check if Password is correct
  if (bcrypt.compareSync(password, user.passwordHash)) {
    // Generate User Token
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.TOKEN_SECRET, // Secret Key
      { expiresIn: "1d" } // Time to expire d|m|y w-week
    );
    // Return User and token Response
    return res
      .status(200)
      .send({
        user: { email: user.email, name: user.name, isAdmin: user.isAdmin },
        token,
      });
  }
  // Send Error Login Message
  res.status(400).send("Incorrect Password");
});

// GET USERS LIST
router.get(`/`, async (req, res) => {
  const userList = await User.find().select("id name email isAdmin");
  if (!userList) res.status(500).json({ success: false });
  res.send(userList);
});

// REGISTER USER
router.post("/", async (req, res) => {
  const data = req.body;

  // create user
  let user = new User({
    name: data.name,
    email: data.email,
    passwordHash: bcrypt.hashSync(data.password, 10),
    phone: data.phone,
    isAdmin: data.isAdmin,
    apartment: data.apartment,
    zip: data.zip,
    street: data.street,
    city: data.city,
    country: data.country,
  });

  // return user
  user = await user.save();
  if (!user) res.status(404).send("Error to create user");
  res.send(user);
});

// GET A USER DETAILS
router.get("/:id", async (req, res) => {
  // Valdate ID
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).send("Invalid User ID");
  }

  // Return User | -passwordHash returns all values less password
  const user = await User.findById(req.params.id).select("-passwordHash");
  if (!user) res.status(404).json({ success: false, message: "Not found" });
  res.status(200).send(user);
});

module.exports = router;
