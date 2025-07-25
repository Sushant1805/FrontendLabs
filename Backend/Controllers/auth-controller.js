const bcrypt = require('bcrypt');
const User = require('../Models/user-model');

const authMiddleware = require('../Middlewares/authMiddleware');

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching user profile" });
    }
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax"
  });
  res.status(200).json({ msg: "Logged out successfully" });
};

const updateProfile = async (req, res) => {
    try {
        const { name, password } = req.body;
        const userId = req.user.id;

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update fields
        if (name) user.name = name;
        if (password) {
            // Password will be hashed automatically by the pre-save middleware
            user.password = password;
        }

        // Save the updated user
        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(userId).select("-password");
        res.status(200).json({ 
            msg: "Profile updated successfully", 
            user: updatedUser 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error updating profile" });
    }
};


// Home route
const home = async (req, res) => {
    try {
        res.status(200).send("From Controller");
    } catch (err) {
        console.error(err);
        const status = 500;
        const message = 'Server Error';
        const error = {
            status,
            message
        }
        next(error);
    }
};

// Register route
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        // Create new user
        const newUser = await User.create({ name, email, password });

        // Send response with token
        res.status(201).json({
            msg: "User registered successfully",
            token: await newUser.generateToken()
        });
    } catch (error) {
        console.error(error);
        const status = 500;
        const message = 'Server error during registration';
        const err = {
            status,
            message
        }
        next(err);
    }
};

// Login route
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, userExist.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // Generate JWT token
        const token = await userExist.generateToken();

        // Set cookie with token
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // true in production
            sameSite: "Lax", // Changed from Strict to Lax for cross-origin requests
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.status(200).json({ msg: "Login successful" });

    } catch (error) {
        console.error(error);
        const status = 500;
        const message = 'Server error during login';
        const err = { status, message };
        next(err);
    }
};


module.exports = { home, register, login, getUser, logout, updateProfile };
