const BaseEvaluator = require('./BaseEvaluator');

class GenericEvaluator extends BaseEvaluator {
  async execute(code, testCase) {
    try {
      const testCode = `
        ${code}
        
        // Create expect function
        const expect = ${this.expect.toString()};
        
        // Run the test
        (async () => {
          try {
            ${testCase.testCode || '// No specific test code provided'}
            return { success: true, result: 'Code executed successfully' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })();
      `;
      
      const result = await this.runTest(testCode, testCase.timeout || 5000);
      
      return {
        name: testCase.name || 'Generic Test',
        input: testCase.description || 'Generic code execution test',
        expected: 'Code executed successfully',
        received: result.success ? result.result : result.error,
        pass: result.success,
        error: result.success ? null : result.error
      };
      
    } catch (error) {
      return {
        name: testCase.name || 'Generic Test',
        input: testCase.description || 'Generic code execution test',
        expected: 'Code executed successfully',
        received: error.message,
        pass: false,
        error: error.message
      };
    }
  }
}

module.exports = GenericEvaluator;





