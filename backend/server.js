require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("Loading auth routes...");

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/tasks", require("./routes/taskRoutes"));
app.use("/user", require("./routes/userRoutes"));

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
    }
};

startServer();