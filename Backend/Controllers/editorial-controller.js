const Editorial = require('../Models/editorial-model');
const Problem = require('../Models/problems-model');

const createEditorial = async (req, res) => {
  try {
    const { problemId, solutions, author } = req.body;

    // Validate that the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if editorial already exists for this problem
    const existingEditorial = await Editorial.findOne({ problemId });
    if (existingEditorial) {
      return res.status(400).json({
        success: false,
        message: 'Editorial already exists for this problem'
      });
    }

    // Validate solutions array
    if (!solutions || !Array.isArray(solutions) || solutions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one solution is required'
      });
    }

    // Validate each solution
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      if (!solution.approachName || !solution.algorithm || !solution.implementation) {
        return res.status(400).json({
          success: false,
          message: `Solution ${i + 1} is missing required fields (approachName, algorithm, implementation)`
        });
      }

      // Validate complexity analysis if provided
      if (solution.complexityAnalysis && Array.isArray(solution.complexityAnalysis)) {
        for (let j = 0; j < solution.complexityAnalysis.length; j++) {
          const analysis = solution.complexityAnalysis[j];
          if (!analysis.complexity || !analysis.explanation) {
            return res.status(400).json({
              success: false,
              message: `Complexity analysis ${j + 1} in solution ${i + 1} is missing required fields`
            });
          }
        }
      }
    }

    // Create new editorial
    const editorial = new Editorial({
      problemId,
      solutions,
      author: author || req.user?.id // Use from auth middleware if available
    });

    const savedEditorial = await editorial.save();

    // Populate the response with problem and author details
    const populatedEditorial = await Editorial.findById(savedEditorial._id)
      .populate('problemId', 'title slug difficulty')
      .populate('author', 'username email');

    res.status(201).json({
      success: true,
      message: 'Editorial created successfully',
      data: populatedEditorial
    });

  } catch (error) {
    console.error('Error creating editorial:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Editorial already exists for this problem'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// Get editorial by problem ID
const getEditorialByProblemId = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Validate that the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const editorial = await Editorial.findOne({ problemId })
      .populate('problemId', 'title slug difficulty tags description')
      .populate('author', 'username email');

    if (!editorial) {
      return res.status(404).json({
        success: false,
        message: 'Editorial not found for this problem'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Editorial retrieved successfully',
      data: editorial
    });

  } catch (error) {
    console.error('Error getting editorial by problem ID:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update editorial by problem ID
const updateEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { solutions, author } = req.body;

    // Validate that the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Check if editorial exists for this problem
    const existingEditorial = await Editorial.findOne({ problemId });
    if (!existingEditorial) {
      return res.status(404).json({
        success: false,
        message: 'Editorial not found for this problem'
      });
    }

    // Validate solutions if provided
    if (solutions) {
      if (!Array.isArray(solutions) || solutions.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one solution is required'
        });
      }

      // Validate each solution
      for (let i = 0; i < solutions.length; i++) {
        const solution = solutions[i];
        if (!solution.approachName || !solution.algorithm || !solution.implementation) {
          return res.status(400).json({
            success: false,
            message: `Solution ${i + 1} is missing required fields (approachName, algorithm, implementation)`
          });
        }

        // Validate complexity analysis if provided
        if (solution.complexityAnalysis && Array.isArray(solution.complexityAnalysis)) {
          for (let j = 0; j < solution.complexityAnalysis.length; j++) {
            const analysis = solution.complexityAnalysis[j];
            if (!analysis.complexity || !analysis.explanation) {
              return res.status(400).json({
                success: false,
                message: `Complexity analysis ${j + 1} in solution ${i + 1} is missing required fields`
              });
            }
          }
        }
      }
    }

    // Prepare update object
    const updateData = {};
    if (solutions) updateData.solutions = solutions;
    if (author) updateData.author = author;
    updateData.updatedAt = new Date();

    // Update editorial by problemId
    const updatedEditorial = await Editorial.findOneAndUpdate(
      { problemId },
      updateData,
      { new: true, runValidators: true }
    )
      .populate('problemId', 'title slug difficulty tags')
      .populate('author', 'username email');

    res.status(200).json({
      success: true,
      message: 'Editorial updated successfully',
      data: updatedEditorial
    });

  } catch (error) {
    console.error('Error updating editorial:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete editorial by problem ID
const deleteEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;

    // Validate that the problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    const editorial = await Editorial.findOne({ problemId });
    if (!editorial) {
      return res.status(404).json({
        success: false,
        message: 'Editorial not found for this problem'
      });
    }

    await Editorial.findOneAndDelete({ problemId });

    res.status(200).json({
      success: true,
      message: 'Editorial deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting editorial:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid problem ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update the module.exports to include all functions
module.exports = {
  createEditorial,
  getEditorialByProblemId,
  updateEditorial,
  deleteEditorial
};
