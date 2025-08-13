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
const getProblemById = async (req, res) => {
  try {
    const { id } = req.params; // must match your route definition

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error('Error fetching problem:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};


const getProblems = async (req, res) => {
  try {
    let { search = "", sort } = req.query;

    // MongoDB filter object
    let query = {};

    // 1. Search (case-insensitive on title)
    if (search.trim()) {
      query.title = { $regex: search, $options: "i" };
    }

    // 2. Sorting by difficulty (Easy → Hard or Hard → Easy)
    // We'll keep MongoDB alphabetical order since your values are "Easy", "Medium", "Hard"
    let sortQuery = {};
    if (sort === "asc") {
      sortQuery = { difficulty: 1 }; // Easy → Medium → Hard
    } else if (sort === "desc") {
      sortQuery = { difficulty: -1 }; // Hard → Medium → Easy
    }

    // Fetch filtered & sorted problems
    const problems = await Problem.find(query).sort(sortQuery);

    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  getProblems
};
