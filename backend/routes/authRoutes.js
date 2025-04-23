const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/protected", auth, (req, res) => {
    res.json({
      message: "You are authorized",
      user: req.user,
    });
  });

module.exports = router;
