const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { EvaluatorRegistry } = require('../executors/EvaluatorRegistry');
const logger = require('../utils/logger');
// evaluatorRegistry used by both Docker and local execution paths
const evaluatorRegistry = new EvaluatorRegistry();

/**
 * Execute user code in Docker container
 * @route POST /api/execute-code
 * @access Public
 */
const executeCode = async (req, res) => {
  try {
    const { code, testCases, problemType = 'function' } = req.body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: "Invalid Code", message: "Code is required and must be a string", pass: false });
    }

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Invalid Test Cases", message: "Test cases are required and must be an array", pass: false });
    }

  const logger = require('../utils/logger');
  logger.info('Executing code for', testCases.length, 'test cases with problem type:', problemType);
    
  // Evaluator registry initialized at module scope

    // If EXECUTOR_URL is provided (Render deployment), forward execution to that service
    const executorUrl = process.env.EXECUTOR_URL;
    if (executorUrl) {
      try {
        const url = executorUrl.replace(/\/$/, '') + '/execute';
        logger.info('Forwarding execution to remote executor:', url);

        // Use global fetch (Node 18+). Construct first testCase only (original behavior)
        const payload = {
          code,
          testCase: testCases[0],
          timeout: 5000,
          problemType
        };

        const controller = new AbortController();
        const fetchTimeout = parseInt(process.env.EXECUTOR_FETCH_TIMEOUT_MS || '15000', 10);
        const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);

        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!resp.ok) {
          const text = await resp.text().catch(() => '');
          logger.error('Remote executor returned non-OK:', resp.status, text);
          return res.status(502).json([{ error: 'Remote executor error', message: text, pass: false }]);
        }

        const results = await resp.json();
        return res.json(results);
      } catch (err) {
        logger.error('Remote executor call failed:', err?.message || err);
        return res.status(502).json([{ error: 'Remote executor unavailable', message: err?.message || 'Request failed', pass: false }]);
      }
    }

  } catch (error) {
    logger.error('Server error in executeCode:', error?.message || error);
    res.status(500).json([{
      error: "Server Error",
      message: "Internal server error occurred",
      pass: false
    }]);
  }
};

/**
 * Fallback local execution (when Docker is not available)
 * Used for development or when Docker is not installed
 */
const executeLocally = async (code, testCases, problemType, res) => {
  try {
  logger.info('Executing code locally (fallback mode)');
    
    const results = [];
    
    // Use the new evaluator system for local execution
    const evaluator = evaluatorRegistry.get(problemType);
    
    for (const testCase of testCases) {
      try {
        const result = await evaluator.execute(code, testCase);
        results.push({
          input: result.input,
          expected: result.expected,
          received: result.received,
          pass: result.pass,
          error: result.error
        });
      } catch (error) {
        results.push({
          input: testCase.input || 'No input provided',
          expected: 'All tests passed',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    res.json(results);
    
    } catch (error) {
    logger.error('Local execution failed:', error?.message || error);
    res.json([{
      error: "Execution Error",
      message: error.message,
      pass: false
    }]);
  }
};

module.exports = {
  executeCode
};
