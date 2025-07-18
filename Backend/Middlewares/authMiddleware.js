const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    console.log("Token from cookie:", token); // 🧠 ADD THIS

    if (!token) {
        return res.status(401).json({ msg: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        console.log("Decoded JWT:", decoded); // 🧠 ADD THIS

        req.user = decoded;
        next();
    } catch (err) {
        console.error("JWT verification error:", err.message); // 🧠 ADD THIS
        return res.status(401).json({ msg: "Invalid token" });
    }
};


module.exports = authMiddleware;
