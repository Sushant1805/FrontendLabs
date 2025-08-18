// Simple script to run the database migration
// Run this manually if needed: node Backend/migrations/run-migration.js

const { removeSolutionField } = require('./remove-solution-from-problems');

console.log('Starting database migration...');
removeSolutionField()
  .then(() => {
    console.log('Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
