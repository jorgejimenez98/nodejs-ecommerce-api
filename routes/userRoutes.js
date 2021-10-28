const User = require("../models/user");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// LOGIN USER
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Find A user with provided email
  const user = await User.findOne({ email: email });
  // Check if user exist
  if (!user) res.status(404).send("User not found");
  // Check if Password is correct
  if (user.checkPassword(password)) {
    // Generate User Token
    const token = user.generateJWT();
    // Return User and token Response
    return res.status(200).send({
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
  try {
    const data = req.body;

    // create user
    let user = new User({
      name: data.name,
      email: data.email,
      phone: data.phone,
      isAdmin: data.isAdmin,
      apartment: data.apartment,
      zip: data.zip,
      street: data.street,
      city: data.city,
      country: data.country,
    });

    // Set password
    user.set_passwordHash(data.password);

    // return user
    user = await user.save();
    if (!user) res.status(404).send("Error to create user");
    res.send(user);
  } catch (error) {
    res.status(404).send({ detail: error.message });
  }
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

// GET USERS COUNT
router.get("/get/count", async (req, res) => {
  const usersCount = await User.countDocuments({});
  if (!usersCount) res.status(500).json({ success: false });
  res.status(200).send({ usersCount: usersCount });
});

// DELETE USER
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  // Valdate ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send("Invalid USER ID");
  }
  // DELETE USER
  User.findByIdAndRemove(id)
    .then((deletedUser) => {
      if (deletedUser)
        return res.status(200).json({ success: true, message: "User Deleted" });
      else {
        return res
          .status(404)
          .json({ success: false, message: "User not Found" });
      }
    })
    .catch((error) => {
      return res.status(404).json({ success: false, error: error });
    });
});

// REGISTER USER
router.post("/register", async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send("the user cannot be created!");

  res.send(user);
});

module.exports = router;
