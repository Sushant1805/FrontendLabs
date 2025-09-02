const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const EvaluatorRegistry = require('../executors/EvaluatorRegistry');

/**
 * Universal Code Execution Controller
 * Handles ALL problem types with robust validation and testing
 */

class UniversalExecutionController {
  constructor() {
    this.supportedProblemTypes = [
      'function', 'class', 'react-component', 'dom-manipulation', 
      'algorithm', 'data-structure', 'utility', 'hook', 'custom'
    ];
    
    this.executionEnvironments = [
      'node', 'browser', 'react', 'jest', 'puppeteer'
    ];
    
    // Initialize the new evaluator system
    this.evaluatorRegistry = new EvaluatorRegistry();
  }

  /**
   * Main execution endpoint
   * @route POST /api/execute/code
   * @access Public
   */
  async executeCode(req, res) {
    try {
      const { code, problemId, testType = 'sample', testCases } = req.body;

      // Validate inputs
      const validation = this.validateExecutionRequest(code, problemId, testType, testCases);
      if (!validation.valid) {
        return res.status(400).json([{
          error: validation.error,
          message: validation.message,
          pass: false
        }]);
      }

      let problem = null;
      let finalTestCases = testCases;

      // If problemId is provided, fetch problem details from database
      if (problemId) {
        problem = await this.getProblemDetails(problemId);
        if (!problem) {
          return res.status(404).json([{
            error: "Problem Not Found",
            message: "The specified problem could not be found",
            pass: false
          }]);
        }

        // Validate code structure against problem requirements
        const codeValidation = this.validateCodeStructure(code, problem);
        if (!codeValidation.valid) {
          return res.status(400).json([{
            error: "Code Structure Error",
            message: codeValidation.message,
            pass: false
          }]);
        }

        // Get appropriate test cases from problem
        finalTestCases = this.getTestCases(problem, testType);
        if (!finalTestCases || finalTestCases.length === 0) {
          return res.status(400).json([{
            error: "No Test Cases",
            message: `No ${testType} test cases available for this problem`,
            pass: false
          }]);
        }
      } else {
        // No problemId provided, use testCases from request body
        if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
          return res.status(400).json([{
            error: "No Test Cases",
            message: "Test cases are required when problemId is not provided",
            pass: false
          }]);
        }

        // Create a minimal problem object for execution
        problem = {
          problemType: 'function', // Default to function
          expectedFunctionName: this.extractFunctionName(code),
          performanceRequirements: { maxExecutionTime: 5000 }, // Default timeout
          validationRules: ['no-eval'] // Basic validation
        };
      }

      // Execute tests based on problem type and environment
      const results = await this.executeTests(code, finalTestCases, problem);

      // Add performance metrics if applicable and problem details available
      if (problemId && testType === 'performance' && problem.performanceTests) {
        const performanceResults = await this.runPerformanceTests(code, problem.performanceTests, problem);
        results.push(...performanceResults);
      }

      // Add edge case testing if applicable and problem details available
      if (problemId && testType === 'main' && problem.edgeCases && problem.edgeCases.length > 0) {
        const edgeCaseResults = await this.runEdgeCaseTests(code, problem.edgeCases, problem);
        results.push(...edgeCaseResults);
      }

      res.json(results);

    } catch (error) {
      console.error('Execution error:', error);
      res.status(500).json([{
        error: "Execution Error",
        message: "An unexpected error occurred during execution",
        pass: false,
        details: error.message
      }]);
    }
  }

  /**
   * Validate execution request
   */
  validateExecutionRequest(code, problemId, testType, testCases) {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return { valid: false, error: "Invalid Code", message: "Code is required and must be a non-empty string" };
    }

    if (!['sample', 'main', 'performance', 'edge'].includes(testType)) {
      return { valid: false, error: "Invalid Test Type", message: "Test type must be one of: sample, main, performance, edge" };
    }

    // Either problemId or testCases must be provided
    if (!problemId && (!testCases || !Array.isArray(testCases) || testCases.length === 0)) {
      return { valid: false, error: "Missing Data", message: "Either problemId or testCases must be provided" };
    }

    return { valid: true };
  }

  /**
   * Get problem details from database
   */
  async getProblemDetails(problemId) {
    try {
      // Import the Problem model
      const Problem = require('../Models/problems-model');
      const problem = await Problem.findById(problemId);
      return problem;
    } catch (error) {
      console.error('Error fetching problem:', error);
      return null;
    }
  }

  /**
   * Validate code structure against problem requirements
   */
  validateCodeStructure(code, problem) {
    const issues = [];

    // Check for required function/class name
    if (problem.problemType === 'function') {
      if (!code.includes(`function ${problem.expectedFunctionName}`)) {
        issues.push(`Function name must be '${problem.expectedFunctionName}'`);
      }
    } else if (problem.problemType === 'class') {
      if (!code.includes(`class ${problem.expectedFunctionName}`)) {
        issues.push(`Class name must be '${problem.expectedFunctionName}'`);
      }
    }

    // Check for forbidden patterns based on validation rules
    for (const rule of problem.validationRules) {
      if (rule === 'no-eval' && code.includes('eval(')) {
        issues.push('eval() is not allowed');
      }
      if (rule === 'no-infinite-loops' && this.detectInfiniteLoops(code)) {
        issues.push('Infinite loops are not allowed');
      }
      if (rule === 'no-global-variables' && this.detectGlobalVariables(code)) {
        issues.push('Global variables are not allowed');
      }
    }

    // Check for required methods in class-based problems
    if (problem.problemType === 'class' && problem.requirements) {
      for (const requirement of problem.requirements) {
        if (requirement.includes('on') && !code.includes('.on(')) {
          issues.push('Class must implement on() method');
        }
        if (requirement.includes('emit') && !code.includes('.emit(')) {
          issues.push('Class must implement emit() method');
        }
      }
    }

    if (issues.length > 0) {
      return { valid: false, message: issues.join('; ') };
    }

    return { valid: true };
  }

  /**
   * Get appropriate test cases based on test type
   */
  getTestCases(problem, testType) {
    let testCases = [];
    
    switch (testType) {
      case 'sample':
        testCases = problem.sampleTestCases || [];
        break;
      case 'main':
        testCases = problem.mainTestCases || [];
        break;
      case 'performance':
        testCases = problem.performanceTests || [];
        break;
      case 'edge':
        testCases = problem.edgeCases || [];
        break;
      default:
        return [];
    }
    
    // Filter out hidden test cases that are not meant to be executed
    return testCases.filter(testCase => !testCase.isHidden);
  }

  /**
   * Execute tests based on problem type
   */
  async executeTests(code, testCases, problem) {
    const results = [];

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        // Use Docker execution instead of evaluators
        const output = await this.executeInSandbox(code, problem.performanceRequirements?.maxExecutionTime || 5000, testCase, problem.problemType);
        const result = JSON.parse(output);
        
        // Add execution time and test name for consistency
        result.executionTime = result.executionTime || 0;
        result.testName = result.name || `Test ${i + 1}`;

        results.push(result);
      } catch (error) {
        results.push({
          testName: testCase.name || `Test ${i + 1}`,
          input: testCase.description || testCase.input || 'No input provided',
          expected: 'All tests passed',
          received: error.message,
          pass: false,
          error: error.message,
          executionTime: 0
        });
      }
    }

    return results;
  }



  /**
   * Run performance tests
   */
  async runPerformanceTests(code, performanceTests, problem) {
    const results = [];
    
    for (const test of performanceTests) {
      try {
        const startTime = Date.now();
        const testCode = this.generatePerformanceTestCode(code, test, problem);
        
        const output = await this.executeInSandbox(testCode, test.maxExecutionTime, test, problem.problemType);
        const executionResult = JSON.parse(output);
        const executionTime = Date.now() - startTime;

        results.push({
          testName: test.name,
          input: test.input,
          expected: test.expectedOutput || test.output || 'No expected output',
          received: executionResult.result || 'Performance test completed',
          pass: executionResult.pass && executionTime <= test.maxExecutionTime,
          executionTime: executionTime,
          maxExecutionTime: test.maxExecutionTime,
          isPerformanceTest: true
        });

      } catch (error) {
        results.push({
          testName: test.name,
          input: test.input,
          expected: test.expectedOutput || test.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message,
          isPerformanceTest: true
        });
      }
    }

    return results;
  }

  /**
   * Run edge case tests
   */
  async runEdgeCaseTests(code, edgeCases, problem) {
    const results = [];
    
    for (const test of edgeCases) {
      try {
        const startTime = Date.now();
        const testCode = this.generateEdgeCaseTestCode(code, test, problem);
        
        const output = await this.executeInSandbox(testCode, problem.performanceRequirements.maxExecutionTime, test, problem.problemType);
        const executionResult = JSON.parse(output);
        const executionTime = Date.now() - startTime;

        results.push({
          testName: test.name,
          input: test.input,
          expected: test.expectedOutput || test.output || 'No expected output',
          received: executionResult.result || 'Edge case test completed',
          pass: executionResult.pass,
          executionTime: executionTime,
          isEdgeCase: true
        });

      } catch (error) {
        results.push({
          testName: test.name,
          input: test.input,
          expected: test.expectedOutput || test.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message,
          isEdgeCase: true
        });
      }
    }

    return results;
  }

  /**
   * Execute code in sandboxed environment
   */
  async executeInSandbox(code, timeout, testCase, problemType = 'function') {
    // Check if Docker is available and try Docker execution first
    try {
      execSync('docker --version', { stdio: 'ignore' });
      console.log('🐳 Docker available, attempting Docker execution...');
      try {
        return await this.executeInDocker(code, timeout, testCase);
      } catch (dockerError) {
        console.log('🐳 Docker execution failed, falling back to local execution:', dockerError.message);
        return await this.executeLocally(code, timeout, testCase);
      }
    } catch (error) {
      console.log('🐳 Docker not available, using local execution');
      return await this.executeLocally(code, timeout, testCase);
    }
  }

  /**
   * Execute in Docker container
   */
  async executeInDocker(code, timeout, testCase, problemType = 'function') {
    const containerId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const dockerCommand = [
        'docker', 'run',
        '--name', containerId,
        '--rm',
        '--memory=128m',
        '--cpus=0.5',
        '--network=none',
        '--user', '1001:1001',
        'code-executor',
        'node', 'executor.js',
        Buffer.from(JSON.stringify(code)).toString('base64'),
        Buffer.from(JSON.stringify(timeout)).toString('base64'),
        Buffer.from(JSON.stringify(testCase)).toString('base64'),
        Buffer.from(JSON.stringify(problemType)).toString('base64')
      ];

      const output = execSync(dockerCommand.join(' '), {
        timeout: timeout + 1000, // Add 1 second buffer
        encoding: 'utf8',
        maxBuffer: 1024 * 1024
      });

      return output.trim();
    } catch (error) {
      throw new Error(`Docker execution failed: ${error.message}`);
    } finally {
      // Cleanup
      try {
        execSync(`docker rm -f ${containerId}`, { stdio: 'ignore' });
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Execute locally (fallback)
   */
  async executeLocally(code, timeout, testCase, problemType = 'function') {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, timeout);

      try {
        // Create a temporary file with the code
        const tempFile = `temp_exec_${Date.now()}.js`;
        const fs = require('fs');
        
        // Write code to temporary file
        fs.writeFileSync(tempFile, code);
        
        try {
          // Execute the temporary file
          const output = execSync(`node ${tempFile}`, {
            timeout: timeout,
            encoding: 'utf8',
            maxBuffer: 1024 * 1024
          });
          
          clearTimeout(timeoutId);
          resolve(output.trim());
        } finally {
          // Clean up temporary file
          try {
            fs.unlinkSync(tempFile);
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }











  /**
   * Detect infinite loops in code
   */
  detectInfiniteLoops(code) {
    const patterns = [
      /while\s*\(\s*true\s*\)/g,
      /for\s*\(\s*;\s*;\s*\)/g,
      /while\s*\(\s*1\s*\)/g
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  /**
   * Detect global variables in code
   */
  detectGlobalVariables(code) {
    const patterns = [
      /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/gm,
      /var\s+[a-zA-Z_$][a-zA-Z0-9_$]*/g,
      /let\s+[a-zA-Z_$][a-zA-Z0-9_$]*/g,
      /const\s+[a-zA-Z_$][a-zA-Z0-9_$]*/g
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  /**
   * Extract function name from code when problemId is not provided
   */
  extractFunctionName(code) {
    const functionMatch = code.match(/function\s+(\w+)/);
    if (functionMatch) {
      return functionMatch[1];
    }
    
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch) {
      return classMatch[1];
    }
    
    return 'main'; // Default function name
  }
}

// Create instance and export methods
const controller = new UniversalExecutionController();

module.exports = {
  executeCode: controller.executeCode.bind(controller)
};
