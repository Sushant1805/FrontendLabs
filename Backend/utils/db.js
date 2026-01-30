const mongoose = require("mongoose");
const logger = require('./logger');

const URI = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        // MongoDB connection successful
        logger.info('MongoDB connected');
    } catch (err) {
        logger.error('MongoDB connection error:', err?.message || err);
    }
};

module.exports = connectDB;