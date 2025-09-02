/**
 * Enhanced Test Executor for Frontend
 * Provides unified interface for all problem types
 */

class EnhancedTestExecutor {
  constructor() {
    this.apiBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    this.supportedProblemTypes = [
      'function', 'class', 'react-component', 'dom-manipulation', 
      'algorithm', 'data-structure', 'utility', 'hook', 'custom'
    ];
  }

  /**
   * Main method to execute tests for any problem type
   * @param {string} code - User's code
   * @param {Array} testCases - Test cases to run
   * @param {string} problemType - Type of problem
   * @param {string} testType - Type of test (sample, main, performance, edge)
   * @param {string} problemId - Problem ID for backend lookup
   * @returns {Promise<Array>} Test results
   */
  async executeTests(code, testCases, problemType, testType = 'sample', problemId = null) {
    try {
      // Validate inputs
      const validation = this.validateTestExecution(code, testCases, problemType, testType);
      if (!validation.valid) {
        return [{
          error: validation.error,
          message: validation.message,
          pass: false
        }];
      }

      // Detect problem type if not provided
      if (!problemType) {
        problemType = this.detectProblemType(code);
      }

      // Execute tests based on problem type
      switch (problemType) {
        case 'function':
          return await this.executeFunctionTests(code, testCases, testType, problemId);
        case 'class':
          return await this.executeClassTests(code, testCases, testType, problemId);
        case 'utility':
          return await this.executeUtilityTests(code, testCases, testType, problemId);
        case 'react-component':
          return await this.executeReactTests(code, testCases, testType, problemId);
        case 'dom-manipulation':
          return await this.executeDOMTests(code, testCases, testType, problemId);
        default:
          return await this.executeGenericTests(code, testCases, testType, problemId);
      }
    } catch (error) {
      console.error('Test execution error:', error);
      return [{
        error: "Execution Error",
        message: error.message,
        pass: false
      }];
    }
  }

  /**
   * Validate test execution parameters
   */
  validateTestExecution(code, testCases, problemType, testType) {
    if (!code || typeof code !== 'string' || code.trim() === '') {
      return { valid: false, error: "No Code", message: "Please write some code to test." };
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return { valid: false, error: "No Test Cases", message: "No test cases available to run." };
    }

    if (problemType && !this.supportedProblemTypes.includes(problemType)) {
      return { valid: false, error: "Unsupported Problem Type", message: `Problem type '${problemType}' is not supported.` };
    }

    if (!['sample', 'main', 'performance', 'edge'].includes(testType)) {
      return { valid: false, error: "Invalid Test Type", message: "Test type must be one of: sample, main, performance, edge" };
    }

    return { valid: true };
  }

  /**
   * Detect problem type from code
   */
  detectProblemType(code) {
    const normalizedCode = code.toLowerCase();
    
    if (normalizedCode.includes('class ') && normalizedCode.includes('constructor')) {
      return 'class';
    }
    
    if (normalizedCode.includes('react') || normalizedCode.includes('jsx') || normalizedCode.includes('component')) {
      return 'react-component';
    }
    
    if (normalizedCode.includes('document.') || normalizedCode.includes('window.') || normalizedCode.includes('dom')) {
      return 'dom-manipulation';
    }
    
    if (normalizedCode.includes('debounce') || normalizedCode.includes('throttle') || normalizedCode.includes('utility')) {
      return 'utility';
    }
    
    if (normalizedCode.includes('function ')) {
      return 'function';
    }
    
    return 'function'; // default
  }

  /**
   * Execute function-based tests
   */
  async executeFunctionTests(code, testCases, testType, problemId) {
    try {
      // Use backend execution if problemId is available
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      // Fallback to local execution
      return await this.executeFunctionTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`Function test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute class-based tests
   */
  async executeClassTests(code, testCases, testType, problemId) {
    try {
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      return await this.executeClassTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`Class test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute utility function tests
   */
  async executeUtilityTests(code, testCases, testType, problemId) {
    try {
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      return await this.executeUtilityTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`Utility test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute React component tests
   */
  async executeReactTests(code, testCases, testType, problemId) {
    try {
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      return await this.executeReactTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`React test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute DOM manipulation tests
   */
  async executeDOMTests(code, testCases, testType, problemId) {
    try {
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      return await this.executeDOMTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`DOM test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute generic tests
   */
  async executeGenericTests(code, testCases, testType, problemId) {
    try {
      if (problemId) {
        return await this.executeOnBackend(code, testCases, testType, problemId);
      }

      return await this.executeGenericTestsLocally(code, testCases);
    } catch (error) {
      throw new Error(`Generic test execution failed: ${error.message}`);
    }
  }

  /**
   * Execute tests on backend
   */
  async executeOnBackend(code, testCases, testType, problemId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/execute/code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemId,
          testType
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const results = await response.json();
      return this.transformBackendResults(results, testCases);
    } catch (error) {
      console.error('Backend execution failed:', error);
      throw error;
    }
  }

  /**
   * Transform backend results to frontend format
   */
  transformBackendResults(backendResults, testCases) {
    return backendResults.map((result, index) => ({
      input: result.input || testCases[index]?.input || `Test ${index + 1}`,
      expected: result.expected || testCases[index]?.expectedOutput || testCases[index]?.output || 'No expected output',
      received: result.received || (result.pass ? 'Correct' : result.error || 'Failed'),
      pass: result.pass,
      error: result.error,
      executionTime: result.executionTime,
      testName: result.testName,
      isPerformanceTest: result.isPerformanceTest,
      isEdgeCase: result.isEdgeCase
    }));
  }

  /**
   * Local function test execution (fallback)
   */
  async executeFunctionTestsLocally(code, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeFunctionTestLocally(code, testCase);
        results.push(result);
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Execute single function test locally
   */
  async executeFunctionTestLocally(code, testCase) {
    return new Promise((resolve, reject) => {
      try {
        // Create a safe execution context
        const testFunction = new Function(`
          ${code}
          
          // Parse input and execute
          const input = ${JSON.stringify(testCase.input)};
          const expected = ${JSON.stringify(testCase.expectedOutput || testCase.output)};
          
          // Execute the function (assuming it's named after the expected function)
          const functionName = Object.keys(this).find(key => typeof this[key] === 'function' && key !== 'testFunction');
          if (!functionName) {
            throw new Error('No function found in code');
          }
          
          const result = this[functionName](input);
          const pass = JSON.stringify(result) === JSON.stringify(expected);
          
          return { result, expected, pass };
        `);

        const executionResult = testFunction.call({});
        
        resolve({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: JSON.stringify(executionResult.result),
          pass: executionResult.pass
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Local class test execution (fallback)
   */
  async executeClassTestsLocally(code, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeClassTestLocally(code, testCase);
        results.push(result);
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Execute single class test locally
   */
  async executeClassTestLocally(code, testCase) {
    return new Promise((resolve, reject) => {
      try {
        // Create a safe execution context for class testing
        const testFunction = new Function(`
          ${code}
          
          // Basic class instantiation test
          try {
            const className = Object.keys(this).find(key => 
              typeof this[key] === 'function' && 
              this[key].toString().includes('class')
            );
            
            if (!className) {
              throw new Error('No class found in code');
            }
            
            const instance = new this[className]();
            return { result: 'Class instantiated successfully', pass: true };
          } catch (error) {
            return { result: error.message, pass: false };
          }
        `);

        const executionResult = testFunction.call({});
        
        resolve({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: executionResult.result,
          pass: executionResult.pass
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Local utility test execution (fallback)
   */
  async executeUtilityTestsLocally(code, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        const result = await this.executeUtilityTestLocally(code, testCase);
        results.push(result);
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Execute single utility test locally
   */
  async executeUtilityTestLocally(code, testCase) {
    return new Promise((resolve, reject) => {
      try {
        // Create a safe execution context for utility testing
        const testFunction = new Function(`
          ${code}
          
          // Basic utility function test
          try {
            const functionName = Object.keys(this).find(key => typeof this[key] === 'function');
            if (!functionName) {
              throw new Error('No function found in code');
            }
            
            // Test if it's a function
            if (typeof this[functionName] === 'function') {
              return { result: 'Utility function found', pass: true };
            } else {
              return { result: 'Not a function', pass: false };
            }
          } catch (error) {
            return { result: error.message, pass: false };
          }
        `);

        const executionResult = testFunction.call({});
        
        resolve({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: executionResult.result,
          pass: executionResult.pass
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Local React test execution (fallback)
   */
  async executeReactTestsLocally(code, testCases) {
    // For React components, we can only do basic syntax validation locally
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Basic React syntax validation
        const hasValidSyntax = this.validateReactSyntax(code);
        
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: hasValidSyntax ? 'React syntax is valid' : 'React syntax has issues',
          pass: hasValidSyntax
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Local DOM test execution (fallback)
   */
  async executeDOMTestsLocally(code, testCases) {
    // For DOM manipulation, we can only do basic syntax validation locally
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Basic DOM syntax validation
        const hasValidSyntax = this.validateDOMSyntax(code);
        
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: hasValidSyntax ? 'DOM syntax is valid' : 'DOM syntax has issues',
          pass: hasValidSyntax
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Local generic test execution (fallback)
   */
  async executeGenericTestsLocally(code, testCases) {
    const results = [];
    
    for (const testCase of testCases) {
      try {
        // Basic syntax validation
        const hasValidSyntax = this.validateGenericSyntax(code);
        
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: hasValidSyntax ? 'Code syntax is valid' : 'Code syntax has issues',
          pass: hasValidSyntax
        });
      } catch (error) {
        results.push({
          input: testCase.input,
          expected: testCase.expectedOutput || testCase.output || 'No expected output',
          received: error.message,
          pass: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Validate React syntax
   */
  validateReactSyntax(code) {
    const patterns = [
      /import\s+.*\s+from\s+['"]react['"]/i,
      /export\s+default/i,
      /function\s+\w+\s*\(/i,
      /const\s+\w+\s*=\s*\(/i
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  /**
   * Validate DOM syntax
   */
  validateDOMSyntax(code) {
    const patterns = [
      /document\./i,
      /window\./i,
      /addEventListener/i,
      /querySelector/i,
      /getElementById/i
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  /**
   * Validate generic syntax
   */
  validateGenericSyntax(code) {
    try {
      // Basic JavaScript syntax validation
      new Function(code);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get test statistics
   */
  getTestStatistics(results) {
    const total = results.length;
    const passed = results.filter(r => r.pass).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    
    const performanceTests = results.filter(r => r.isPerformanceTest);
    const edgeCases = results.filter(r => r.isEdgeCase);
    
    const avgExecutionTime = results.length > 0 
      ? results.reduce((sum, r) => sum + (r.executionTime || 0), 0) / results.length 
      : 0;

    return {
      total,
      passed,
      failed,
      successRate: Math.round(successRate * 100) / 100,
      performanceTests: performanceTests.length,
      edgeCases: edgeCases.length,
      avgExecutionTime: Math.round(avgExecutionTime)
    };
  }

  /**
   * Format test results for display
   */
  formatTestResults(results) {
    return results.map((result, index) => ({
      id: index + 1,
      name: result.testName || `Test ${index + 1}`,
      input: result.input,
      expected: result.expected,
      received: result.received,
      pass: result.pass,
      error: result.error,
      executionTime: result.executionTime,
      type: result.isPerformanceTest ? 'performance' : 
            result.isEdgeCase ? 'edge' : 'standard'
    }));
  }
}

export default EnhancedTestExecutor;
