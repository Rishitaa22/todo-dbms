const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("No token provided");
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        console.log("Token verified for userId:", decoded.userId);
        req.user = { id: decoded.userId };
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(403).json({ message: "Invalid token" });
    }
};
