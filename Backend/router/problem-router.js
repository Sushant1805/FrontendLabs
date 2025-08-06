const express = require('express');
const router = express.Router();
const {
  createProblem,
  getProblems,
  getProblemBySlug,
} = require('../Controllers/problem-controller');

// If you're using auth, add middleware here
router.post('/', createProblem);
router.get('/', getProblems);
router.get('/:slug', getProblemBySlug);

module.exports = router;
