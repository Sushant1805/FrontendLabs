const bcrypt = require('bcrypt');
const User = require('../Models/user-model');

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
const login = async (req, res) => {
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

        res.status(200).json({
            msg: "Login successful",
            token: await userExist.generateToken()
        });
    } catch (error) {
        console.error(error);
        const status = 500;
        const message = 'Server error during login';
        const err = {
            status,
            message
        }
        next(err);
    }
};

module.exports = { home, register, login };
