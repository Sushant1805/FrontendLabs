require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../Models/problems-model'); // adjust path
const problems = require('./Problems-data'); // file with the problems array // adjust path

// MongoDB connection URL
const URI = 'mongodb+srv://admin:Sushant%4018@cluster0.mm1sgjp.mongodb.net/FrontendLabsDB?retryWrites=true&w=majority&appName=Cluster0';

async function seedProblems() {
  try {
    await mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const logger = require('../utils/logger');
  logger.info('Connected to MongoDB');

    // Optional: Clear old data first
    await Problem.deleteMany({});
  logger.info('Old problems deleted');

    // Insert all problems
    await Problem.insertMany(problems);
  logger.info('Problems inserted successfully!');

    mongoose.disconnect();
  } catch (err) {
  const logger = require('../utils/logger');
  logger.error('Error seeding problems:', err?.message || err);
    process.exit(1);
  }
}

seedProblems();
