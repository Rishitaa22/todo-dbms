const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User"); // ✅ ADD THIS

console.log("AuthRoutes file executed");

// TEST ROUTE
router.get("/test", (req, res) => {
    res.send("Auth working");
});

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, password, fullName, email } = req.body;

        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({ message: "Username exists" });
        }

        const user = await User.create({ username, password, fullName, email });

        res.json({ message: "User created" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret_key", { expiresIn: "7d" });

        res.json({ token, message: "Login successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;