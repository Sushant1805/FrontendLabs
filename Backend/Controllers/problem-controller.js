const Problem = require('../Models/problems-model');

// @desc   Create a new problem
// @route  POST /api/problems
// @access Private (add auth later if needed)
const createProblem = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      difficulty,
      tags,
      functionSignature,
      starterCode,
      constraints,
      testCases,
      hiddenTestCases,
      expectedFunctionName,
      solutionCode,
    } = req.body;

    // Check for duplicate slug or title
    const existing = await Problem.findOne({ $or: [{ title }, { slug }] });
    if (existing) {
      return res.status(400).json({ message: 'Problem with this title or slug already exists' });
    }

    const newProblem = new Problem({
      title,
      slug,
      description,
      difficulty,
      tags,
      functionSignature,
      starterCode,
      constraints,
      testCases,
      hiddenTestCases,
      expectedFunctionName,
      solutionCode,
      author: req.user?._id || null, // Add author if using auth
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (error) {
    console.error('Error creating problem:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc   Get all problems
// @route  GET /api/problems
// @access Public
const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find().select('-solutionCode -hiddenTestCases'); // Hide solution and hidden cases
    res.status(200).json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc   Get a single problem by slug
// @route  GET /api/problems/:slug
// @access Public
const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemBySlug,
};
