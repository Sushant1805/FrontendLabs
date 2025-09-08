const BaseEvaluator = require('./BaseEvaluator');

class ClassEvaluator extends BaseEvaluator {
  async execute(code, testCase) {
    try {
      const className = this.extractClassName(code);
      if (!className) {
        throw new Error('No class found in code');
      }
      
      const testCode = `
        ${code}
        
        // Create expect function
        const expect = ${this.expect.toString()};
        
        // Run the test
        (async () => {
          try {
            const instance = new ${className}();
            ${testCase.testCode}
            return { success: true, result: 'All tests passed' };
          } catch (error) {
            return { success: false, error: error.message };
          }
        })();
      `;
      
      const result = await this.runTest(testCode, testCase.timeout || 5000);
      
      return {
        name: testCase.name || 'Class Test',
        input: testCase.description || 'Class instantiation and method test',
        expected: 'All tests passed',
        received: result.success ? result.result : result.error,
        pass: result.success,
        error: result.success ? null : result.error
      };
      
    } catch (error) {
      return {
        name: testCase.name || 'Class Test',
        input: testCase.description || 'Class instantiation and method test',
        expected: 'All tests passed',
        received: error.message,
        pass: false,
        error: error.message
      };
    }
  }
  
  extractClassName(code) {
    const match = code.match(/class\s+(\w+)/);
    return match ? match[1] : null;
  }
}

module.exports = ClassEvaluator;




