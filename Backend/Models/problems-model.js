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
  languages: {
    type: [String], // e.g. ["JavaScript", "Python", "Java"]
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
  // In problems-model.js
constraints: {
  type: [String], // array of strings
  required: true
},

  // Public test cases shown to the user
  sampleTestCases: [
    {
      input: { type: String, required: true }, // "nums = [2,7,11,15], target = 9"
      output: { type: String, required: true }, // "[0,1]"
      explanation: { type: String, default: '' },
    },
  ],

  // Hidden/private test cases for final validation
  mainTestCases: [
    {
      input: { type: String, required: true },
      output: { type: String, required: true },
      explanation: { type: String, default: '' },
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
  solution: {
    type: String, // Human-readable explanation
    default: '',
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
