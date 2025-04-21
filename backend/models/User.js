const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name required"],
  },
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password required"],
  },
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to generate JWT Token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

module.exports = mongoose.model("User", UserSchema);
