const BaseEvaluator = require('./BaseEvaluator');

class UtilityEvaluator extends BaseEvaluator {
  async execute(code, testCase) {
    try {
      const functionName = this.extractFunctionName(code);
      if (!functionName) {
        throw new Error('No function found in code');
      }
      
      const testCode = `
        ${code}
        
        // Create expect function
        const expect = ${this.expect.toString()};
        
        // Run the test
        (async () => {
          try {
            ${testCase.testCode}
            return { success: true, result: 'All tests passed' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })();
      `;
      
      const result = await this.runTest(testCode, testCase.timeout || 5000);
      
      return {
        name: testCase.name || 'Utility Test',
        input: testCase.description || 'Utility function test',
        expected: 'All tests passed',
        received: result.success ? result.result : result.error,
        pass: result.success,
        error: result.success ? null : result.error
      };
      
    } catch (error) {
      return {
        name: testCase.name || 'Utility Test',
        input: testCase.description || 'Utility function test',
        expected: 'All tests passed',
        received: error.message,
        pass: false,
        error: error.message
      };
    }
  }
  
  extractFunctionName(code) {
    // Look for function declarations or arrow functions
    const functionMatch = code.match(/function\s+(\w+)/);
    if (functionMatch) return functionMatch[1];
    
    const constMatch = code.match(/const\s+(\w+)\s*=/);
    if (constMatch) return constMatch[1];
    
    const letMatch = code.match(/let\s+(\w+)\s*=/);
    if (letMatch) return letMatch[1];
    
    return null;
  }
}

module.exports = UtilityEvaluator;



