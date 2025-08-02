const express = require('express');
const router = express.Router();
const {
  createProblem,
  getAllProblems,
  getProblemBySlug,
} = require('../Controllers/problem-controller');

// If you're using auth, add middleware here
router.post('/', createProblem);
router.get('/', getAllProblems);
router.get('/:slug', getProblemBySlug);

module.exports = router;
