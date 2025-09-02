const BaseEvaluator = require('./BaseEvaluator');

class FunctionEvaluator extends BaseEvaluator {
  async execute(code, testCase) {
    try {
      const functionName = this.extractFunctionName(code);
      if (!functionName) {
        throw new Error('No function found in code');
      }
      
      const testCode = `
        ${code}
        
        // Create expect function
        const expect = (actual) => ({
          toBe: (expected) => {
            if (actual !== expected) {
              throw new Error(\`Expected \${JSON.stringify(actual)} to be \${JSON.stringify(expected)}\`);
            }
            return true;
          },
          toEqual: (expected) => {
            if (JSON.stringify(actual) !== JSON.stringify(expected)) {
              throw new Error(\`Expected \${JSON.stringify(actual)} to equal \${JSON.stringify(expected)}\`);
            }
            return true;
          },
          toBeTruthy: () => {
            if (!actual) {
              throw new Error(\`Expected \${JSON.stringify(actual)} to be truthy\`);
            }
            return true;
          },
          toBeFalsy: () => {
            if (actual) {
              throw new Error(\`Expected \${JSON.stringify(actual)} to be falsy\`);
            }
            return true;
          },
          toThrow: () => {
            try {
              if (typeof actual === 'function') {
                actual();
              }
              throw new Error('Expected function to throw an error');
            } catch (error) {
              return true;
            }
          },
          toHaveLength: (expected) => {
            if (!Array.isArray(actual) && typeof actual !== 'string') {
              throw new Error(\`Expected \${JSON.stringify(actual)} to have a length property\`);
            }
            if (actual.length !== expected) {
              throw new Error(\`Expected \${JSON.stringify(actual)} to have length \${expected}, but got \${actual.length}\`);
            }
            return true;
          },
          not: {
            toBe: (expected) => {
              if (actual === expected) {
                throw new Error(\`Expected \${JSON.stringify(actual)} not to be \${JSON.stringify(expected)}\`);
              }
              return true;
            },
            toEqual: (expected) => {
              if (JSON.stringify(actual) === JSON.stringify(expected)) {
                throw new Error(\`Expected \${JSON.stringify(actual)} not to equal \${JSON.stringify(expected)}\`);
              }
              return true;
            }
          }
        });
        
        // Run the test
        try {
          ${testCase.testCode}
          console.log(JSON.stringify({ success: true, result: 'All tests passed' }));
        } catch (error) {
          console.log(JSON.stringify({ success: false, error: error.message }));
        }
      `;
      
      const result = await this.runTest(testCode, testCase.timeout || 5000);
      
      return {
        name: testCase.name || 'Function Test',
        input: testCase.description || 'Function execution test',
        expected: 'All tests passed',
        received: result.success ? result.result : result.error,
        pass: result.success,
        error: result.success ? null : result.error
      };
      
    } catch (error) {
      return {
        name: testCase.name || 'Function Test',
        input: testCase.description || 'Function execution test',
        expected: 'All tests passed',
        received: error.message,
        pass: false,
        error: error.message
      };
    }
  }
  
  extractFunctionName(code) {
    const match = code.match(/function\s+(\w+)/);
    return match ? match[1] : null;
  }
}

module.exports = FunctionEvaluator;


