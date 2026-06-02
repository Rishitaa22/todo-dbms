const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// Create task
router.post("/", auth, async (req, res) => {
    try {
        const { title, priority } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        console.log("Creating task for userId:", req.user.id);

        const task = await Task.create({
            userId: req.user.id,
            title,
            priority: priority || "low",
            completed: false
        });

        console.log("Task created successfully:", task);
        res.json(task);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: error.message });
    }
});

// Get tasks
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update task
router.put("/:id", auth, async (req, res) => {
    try {
        const updated = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body, // allows updating title, priority, completed
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete task
router.delete("/:id", auth, async (req, res) => {
    try {
        const deleted = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!deleted) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;