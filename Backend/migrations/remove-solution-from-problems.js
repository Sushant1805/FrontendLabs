require('dotenv').config();
const mongoose = require('mongoose');
const Problem = require('../Models/problems-model');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to remove solution field from all problems
const removeSolutionField = async () => {
  try {
    console.log('Starting migration: Removing solution field from problems...');
    
    // Update all problem documents to remove the solution field
    const result = await Problem.updateMany(
      {}, // Empty filter to match all documents
      { $unset: { solution: "" } } // Remove the solution field
    );
    
    console.log(`Migration completed successfully!`);
    console.log(`Documents matched: ${result.matchedCount}`);
    console.log(`Documents modified: ${result.modifiedCount}`);
    
    // Verify the migration by checking if any documents still have the solution field
    const documentsWithSolution = await Problem.countDocuments({ solution: { $exists: true } });
    
    if (documentsWithSolution === 0) {
      console.log('✅ Verification passed: No documents have the solution field anymore');
    } else {
      console.log(`⚠️  Warning: ${documentsWithSolution} documents still have the solution field`);
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Main execution function
const runMigration = async () => {
  try {
    await connectDB();
    await removeSolutionField();
    console.log('Migration process completed successfully!');
  } catch (error) {
    console.error('Migration process failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the migration
if (require.main === module) {
  runMigration();
}

module.exports = { removeSolutionField };
