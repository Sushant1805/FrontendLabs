const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { EvaluatorRegistry } = require('../executors/EvaluatorRegistry');

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
      return res.status(400).json([{
        error: "Invalid Code",
        message: "Code is required and must be a string",
        pass: false
      }]);
    }

    if (!testCases || !Array.isArray(testCases)) {
      return res.status(400).json([{
        error: "Invalid Test Cases",
        message: "Test cases are required and must be an array",
        pass: false
      ]);
    }

    console.log('Executing code for', testCases.length, 'test cases with problem type:', problemType);
    
    // Initialize the new evaluator system
    const evaluatorRegistry = new EvaluatorRegistry();

    // Check if Docker is available
    try {
      execSync('docker --version', { stdio: 'ignore' });
      // Also check if Docker daemon is running
      execSync('docker info', { stdio: 'ignore' });
    } catch (error) {
      console.warn('Docker not available, falling back to local execution');
      return executeLocally(code, testCases, problemType, res);
    }

    // Build Docker image if it doesn't exist
    const dockerImageName = 'code-executor';
    try {
      execSync(`docker image inspect ${dockerImageName}`, { stdio: 'ignore' });
    } catch (error) {
      console.log('Building Docker image...');
      const dockerfilePath = path.join(__dirname, '../docker-executor');
      execSync(`docker build -t ${dockerImageName} ${dockerfilePath}`, { stdio: 'inherit' });
    }

    // Execute code in Docker container
    const containerId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const dockerCommand = [
        'docker', 'run',
        '--name', containerId,
        '--rm',                          // Remove container after execution
        '--memory=128m',                 // Limit memory to 128MB
        '--cpus=0.5',                   // Limit CPU usage
        '--network=none',               // No network access
        '--read-only',                  // Read-only filesystem
        '--tmpfs', '/tmp:exec,size=10m', // Temporary filesystem for execution
        '--user', '1001:1001',          // Run as non-root user
        dockerImageName,
        'node', 'executor.js',
        Buffer.from(JSON.stringify(code)).toString('base64'),
        Buffer.from(JSON.stringify(5000)).toString('base64'), // timeout
        Buffer.from(JSON.stringify(testCases[0])).toString('base64'), // single test case
        Buffer.from(JSON.stringify(problemType)).toString('base64') // problem type
      ];

      console.log('Running Docker container:', containerId);
      
      const output = execSync(dockerCommand.join(' '), {
        timeout: 10000, // 10 second timeout
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 // 1MB buffer
      });

      const results = JSON.parse(output.trim());
      console.log('Execution completed successfully');
      
      res.json(results);

    } catch (error) {
      console.error('Docker execution failed:', error.message);
      
      // Clean up container if it exists
      try {
        execSync(`docker rm -f ${containerId}`, { stdio: 'ignore' });
      } catch (e) {
        // Ignore cleanup errors
      }

      // Return execution error
      res.json([{
        error: "Execution Error",
        message: error.message.includes('timeout') ? 
          'Code execution timed out (10 seconds limit)' : 
          'Code execution failed',
        pass: false
      }]);
    }

  } catch (error) {
    console.error('Server error in executeCode:', error);
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
    console.log('Executing code locally (fallback mode)');
    
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
    console.error('Local execution failed:', error);
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
