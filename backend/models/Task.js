const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low"
    }
}, { timestamps: true });

taskSchema.index({ userId: 1 });

module.exports = mongoose.model("Task", taskSchema);
