const mongoose = require('mongoose');

const problemsSchema = new mongoose.Schema({
  // Basic Information
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
  
  // Problem Classification
  problemType: {
    type: String,
    enum: ['function', 'class', 'react-component', 'dom-manipulation', 'algorithm', 'data-structure', 'utility', 'hook', 'custom'],
    required: true,
    default: 'function'
  },
  
  // Technical Specifications
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Expert'],
    required: true,
  },
  
  category: {
    type: String,
    enum: ['JavaScript', 'React', 'DOM', 'Algorithms', 'Data Structures', 'Browser APIs', 'Performance', 'Testing'],
    required: true,
    default: 'JavaScript'
  },
  
  tags: {
    type: [String],
    default: [],
  },
  
  // Execution Environment
  executionEnvironment: {
    type: String,
    enum: ['node', 'browser', 'react', 'jest', 'puppeteer'],
    required: true,
    default: 'node'
  },
  
  // Code Specifications
  functionSignature: {
    type: String, // Signature user sees (e.g. function twoSum(nums, target) {})
    required: true,
  },
  
  starterCode: {
    type: String, // Pre-filled editor code
    default: '',
  },
  
  expectedFunctionName: {
    type: String,
    required: true, // Helps enforce naming for eval
  },
  
  // Requirements and Constraints
  requirements: {
    type: [String], // Array of structured requirements
    default: [],
  },
  
  constraints: {
    type: [String], // array of strings
    required: true
  },
  
  // Performance Requirements
  performanceRequirements: {
    timeComplexity: {
      type: String,
      enum: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'Not specified'],
      default: 'Not specified'
    },
    spaceComplexity: {
      type: String,
      enum: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'Not specified'],
      default: 'Not specified'
    },
    maxExecutionTime: {
      type: Number, // in milliseconds
      default: 5000
    },
    maxMemoryUsage: {
      type: Number, // in MB
      default: 128
    }
  },
  
  // Code Quality and Validation
  validationRules: {
    type: [String],
    enum: [
      'no-global-variables',
      'no-infinite-loops', 
      'no-eval',
      'no-innerHTML',
      'no-document-write',
      'no-alert',
      'no-console-log',
      'no-debugger',
      'no-var',
      'no-let',
      'no-const',
      'no-arrow-functions',
      'no-template-literals',
      'no-destructuring',
      'no-spread-operator',
      'no-rest-parameters',
      'no-async-await',
      'no-promises',
      'no-generators',
      'no-classes',
      'no-modules',
      'no-imports',
      'no-exports'
    ],
    default: ['no-infinite-loops', 'no-eval']
  },
  
  // Test Framework Configuration
  testFramework: {
    type: String,
    enum: ['jest', 'mocha', 'custom', 'none'],
    default: 'jest'
  },
  
  // Enhanced Test Cases
  sampleTestCases: [
    {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      input: { type: mongoose.Schema.Types.Mixed, required: false }, // Can be string, object, array
      expectedOutput: { type: mongoose.Schema.Types.Mixed, required: false },
      explanation: { type: String, default: '' },
      testCode: { type: String, required: false }, // Jest test code for complex scenarios
      timeout: { type: Number, default: 5000 }, // Test timeout in ms
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    },
  ],
  
  mainTestCases: [
    {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      input: { type: mongoose.Schema.Types.Mixed, required: false },
      expectedOutput: { type: mongoose.Schema.Types.Mixed, required: false },
      explanation: { type: String, default: '' },
      testCode: { type: String, required: false },
      timeout: { type: Number, default: 5000 },
      isHidden: { type: Boolean, default: true },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    },
  ],
  
  // Edge Cases and Special Tests
  edgeCases: [
    {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      input: { type: mongoose.Schema.Types.Mixed, required: false },
      expectedOutput: { type: mongoose.Schema.Types.Mixed, required: false },
      testCode: { type: String, required: false },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    }
  ],
  
  // Performance Tests
  performanceTests: [
    {
      name: { type: String, required: true },
      description: { type: String, default: '' },
      input: { type: mongoose.Schema.Types.Mixed, required: false },
      expectedOutput: { type: mongoose.Schema.Types.Mixed, required: false },
      maxExecutionTime: { type: Number, required: true }, // in ms
      testCode: { type: String, required: false },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
    }
  ],
  
  // Solution and Reference
  solutionCode: {
    type: String,
    required: true, // Used to run tests against
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now,
  },
  
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  // Statistics
  stats: {
    totalSubmissions: { type: Number, default: 0 },
    successfulSubmissions: { type: Number, default: 0 },
    averageCompletionTime: { type: Number, default: 0 }, // in minutes
    successRate: { type: Number, default: 0 }, // percentage
    difficultyRating: { type: Number, default: 0 }, // user-rated difficulty 1-5
  },
  
  // Version Control
  version: {
    type: Number,
    default: 1
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
});

// Validation function for test cases
function validateTestCase(testCase) {
  const hasInputOutput = testCase.input !== undefined && testCase.expectedOutput !== undefined;
  const hasTestCode = testCase.testCode && testCase.testCode.trim() !== '';
  
  if (!hasInputOutput && !hasTestCode) {
    throw new Error('Test case must have either (input and expectedOutput) or testCode');
  }
  
  return true;
}

// Validate test cases before saving
problemsSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Validate all test case arrays
  const allTestCases = [
    ...(this.sampleTestCases || []),
    ...(this.mainTestCases || []),
    ...(this.edgeCases || []),
    ...(this.performanceTests || [])
  ];
  
  for (const testCase of allTestCases) {
    try {
      validateTestCase(testCase);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

module.exports = mongoose.model('Problem', problemsSchema);
