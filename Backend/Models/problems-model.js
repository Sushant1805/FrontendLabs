const mongoose = require('mongoose');

const problemsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  functionSignature: {
    type: String, // Signature user sees (e.g. function twoSum(nums, target) {})
    required: true,
  },
  starterCode: {
    type: String, // Pre-filled editor code
    default: '',
  },
  constraints: {
    type: String,
    default: '', // E.g., “O(n) expected”, “No built-in sort”
  },
  testCases: [
    {
      input: { type: String, required: true }, // "nums = [2,7,11,15], target = 9"
      output: { type: String, required: true }, // "[0,1]"
      explanation: { type: String, default: '' },
    },
  ],
  hiddenTestCases: [
    {
      input: { type: String },
      output: { type: String },
    },
  ],
  expectedFunctionName: {
    type: String,
    required: true, // Helps enforce naming for eval
  },
  solutionCode: {
    type: String,
    required: true, // Used to run tests against
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Problem', problemsSchema);
