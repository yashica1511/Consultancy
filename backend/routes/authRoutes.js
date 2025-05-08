const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  loginUser,
  forgotPassword,
  registerUser,
  verifyOtp,
  resetPassword,
} = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/register", registerUser);

router.get("/protected", auth, (req, res) => {
    res.json({
      message: "You are authorized",
      user: req.user,
    });
  });

module.exports = router;
