const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  res.send("User routes are working!");
});

// register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).send({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).send({ error: error, details: error });
  }
});

// logic to register a new user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.JWT_SECRET_KEY
    );

    res.status(200).send({
      message: "Login successful",
      user,
      token: token,
    });
  } catch (error) {
    return res
      .status(400)
      .send({ error: "Login failed", details: error.message });
  }
});

module.exports = router;
