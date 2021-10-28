const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Email is invalid"],
    unique: true,
    index: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
});

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

// Methods
// Generate Token
UserSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      userId: this.id,
      isAdmin: this.isAdmin,
    },
    process.env.TOKEN_SECRET, // Secret Key
    { expiresIn: "1d" } // Time to expire d|m|y w-week
  );
};

// Check Password
UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// SET Password
UserSchema.methods.set_passwordHash = function (password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
