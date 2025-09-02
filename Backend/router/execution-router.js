const express = require('express');
const router = express.Router();
const { executeCode } = require('../Controllers/universal-execution-controller');

// @route   POST /api/execute/code
// @desc    Execute user code with universal execution controller
// @access  Public
router.post('/code', executeCode);

module.exports = router;
