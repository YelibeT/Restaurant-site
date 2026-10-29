import express from "express";
import User from "../models/User.js";
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      phone: req.body.phone
    });
    const savedUser = await newUser.save();
    return res.status(201).json(savedUser);
  } catch (err) {
    console.error("REGISTER ERROR:", err); 
    res.status(500).json({ message: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  console.log("Login attempt for:", req.body); 
  try {
    
    const phone = req.body.phone?.trim(); 
    
    const user = await User.findOne({ phone: phone });
    
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found. Please register!" });
    }
  } catch (err) {
    console.error("Login crash:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
