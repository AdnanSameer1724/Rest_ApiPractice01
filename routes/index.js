const express = require("express");
const router = express.Router();
const Authentication = require("../models/authentication");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.json({ message: "Welcome to API" });
});

router.post("/forgetPassword", async (req, res) => {
  try {
    const { emailID, password, confirmPassword } = req.body;

    const user = await Authentication.findOne({ emailID });
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }

    if (password !== confirmPassword) {
      return res.status(401).json({ message: "Password doesn't match" });
    }

    user.password = password;
    await user.save();
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const user = await Authentication.findOne({ emailID });
    if (!user) {
      return res.status(400).json({ message: "Invalid Username" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ emailID: user.emailID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successfull", token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { emailID, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailID)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await Authentication.findOne({ emailID });
    if (existingUser) {
      return res.status(400).json({ message: "Account already exists" });
    }

    const newUser = new Authentication({
      emailID,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});

router.get("/dashboard", authMiddleware, (req, res) => {
    res.status(200).json({ message: "Welcome Onboard", user: req.user });
});

module.exports = router;