const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Create temp directory for execution
const tempDir = path.join(os.tmpdir(), 'execution');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

class BaseEvaluator {
  constructor() {
    this.expect = this.createExpectFunction();
  }
  
  createExpectFunction() {
    return (actual) => ({
      toBe: (expected) => this.assertStrictEqual(actual, expected),
      toEqual: (expected) => this.assertDeepEqual(actual, expected),
      toBeTruthy: () => this.assertTruthy(actual),
      toBeFalsy: () => this.assertFalsy(actual),
      toThrow: () => this.assertThrows(actual),
      toHaveLength: (expected) => this.assertLength(actual, expected),
      not: {
        toBe: (expected) => this.assertNotStrictEqual(actual, expected),
        toEqual: (expected) => this.assertNotDeepEqual(actual, expected),
        toBeTruthy: () => this.assertFalsy(actual),
        toBeFalsy: () => this.assertTruthy(actual)
      }
    });
  }
  
  assertStrictEqual(actual, expected) {
    if (actual !== expected) {
      throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`);
    }
    return true;
  }
  
  assertDeepEqual(actual, expected) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    }
    return true;
  }
  
  assertTruthy(actual) {
    if (!actual) {
      throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`);
    }
    return true;
  }
  
  assertFalsy(actual) {
    if (actual) {
      throw new Error(`Expected ${JSON.stringify(actual)} to be falsy`);
    }
    return true;
  }
  
  assertThrows(fn) {
    try {
      if (typeof fn === 'function') {
        fn();
      }
      throw new Error('Expected function to throw an error');
    } catch (error) {
      return true;
    }
  }
  
  assertLength(actual, expected) {
    if (!Array.isArray(actual) && typeof actual !== 'string') {
      throw new Error(`Expected ${JSON.stringify(actual)} to have a length property`);
    }
    if (actual.length !== expected) {
      throw new Error(`Expected ${JSON.stringify(actual)} to have length ${expected}, but got ${actual.length}`);
    }
    return true;
  }
  
  assertNotStrictEqual(actual, expected) {
    if (actual === expected) {
      throw new Error(`Expected ${JSON.stringify(actual)} not to be ${JSON.stringify(expected)}`);
    }
    return true;
  }
  
  assertNotDeepEqual(actual, expected) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      throw new Error(`Expected ${JSON.stringify(actual)} not to equal ${JSON.stringify(expected)}`);
    }
    return true;
  }
  
  async runTest(testCode, timeout = 5000) {
    try {
      // Write test code to temporary file
      const tempTestFile = path.join(tempDir, `temp_test_${Date.now()}.js`);
      fs.writeFileSync(tempTestFile, testCode);
      
      // Execute the test file
      const output = execSync(`node ${tempTestFile}`, {
        timeout: timeout,
        encoding: 'utf8'
      });
      
      // Clean up temp file
      try {
        fs.unlinkSync(tempTestFile);
      } catch (e) {
        // Ignore cleanup errors
      }
      
      return JSON.parse(output.trim());
    } catch (error) {
      // Clean up temp file on error
      try {
        const tempTestFile = path.join(tempDir, `temp_test_${Date.now()}.js`);
        if (fs.existsSync(tempTestFile)) {
          fs.unlinkSync(tempTestFile);
        }
      } catch (e) {
        // Ignore cleanup errors
      }
      
      throw error;
    }
  }
  
  async execute(code, testCase) {
    // Template method - to be implemented by subclasses
    throw new Error('execute method must be implemented');
  }
}

module.exports = BaseEvaluator;


