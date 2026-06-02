const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// Get user profile
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update profile
router.put("/edit", auth, async (req, res) => {
    try {
        const { username, fullName, email } = req.body;

        // Check if username is being changed and if it's already taken
        if (username) {
            const existingUser = await User.findOne({ 
                username, 
                _id: { $ne: req.user.id } // Exclude current user
            });
            if (existingUser) {
                return res.status(400).json({ message: "Username already taken" });
            }
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { username, fullName, email },
            { new: true }
        ).select("-password");

        if (!updated) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;