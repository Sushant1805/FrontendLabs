const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    // Support token from cookie OR Authorization header (Bearer <token>) as a fallback
    const cookieToken = req.cookies && req.cookies.token;
    const header = req.headers && (req.headers.authorization || req.headers.Authorization);
    const headerToken = header && header.split(' ')[0] && header.split(' ')[1] ? header.split(' ')[1] : null;
    const token = cookieToken || headerToken;
    console.log("Token from cookie:", cookieToken, "header:", headerToken);

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
