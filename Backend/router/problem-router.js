const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getProblemById,
} = require('../Controllers/problem-controller');

// If you're using auth, add middleware here
router.post('/', createProblem);
router.get('/', getProblems);
router.get('/:id', getProblemById);

module.exports = router;
