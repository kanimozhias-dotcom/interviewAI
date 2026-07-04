import express from "express";
import User from "../models/User.js";
import {
  register,
  login,
  deleteAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Get logged-in user's full profile
router.get("/me", protect, async (req, res) => {
  try {
    // Re-fetch to guarantee all fields are present (middleware only selects a subset)
    const user = await User.findById(req.user._id).select(
      "_id name email bio avatar streak totalInterviews lastInterviewDate createdAt"
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update profile (name, bio, avatar)
router.put("/me", protect, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    // Fetch the full document so all schema validators pass on save()
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        streak: user.streak,
        totalInterviews: user.totalInterviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/delete", protect, deleteAccount);

export default router;