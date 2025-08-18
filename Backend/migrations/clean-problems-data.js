const fs = require('fs');
const path = require('path');

// Read the Problems-data.js file
const filePath = path.join(__dirname, '../Controllers/Problems-data.js');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Cleaning Problems-data.js file...');

// Remove all solution fields using regex
// This regex matches: solution: `...` (including multiline content)
const solutionRegex = /,\s*solution:\s*`[^`]*(?:`[^`]*)*`/g;

// Count matches before removal
const matches = content.match(solutionRegex);
console.log(`Found ${matches ? matches.length : 0} solution fields to remove`);

// Remove all solution fields
content = content.replace(solutionRegex, '');

// Write the cleaned content back to the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Successfully removed all solution fields from Problems-data.js');
console.log('The file has been updated and is ready to use with the new editorial system.');
