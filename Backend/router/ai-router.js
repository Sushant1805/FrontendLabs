const express = require('express');
const router = express.Router();
const { explain } = require('../Controllers/ai-controller');

// POST /api/ai/explain - send code, problem and test results for AI analysis
router.post('/explain', explain);

module.exports = router;
