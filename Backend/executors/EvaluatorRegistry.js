const FunctionEvaluator = require('./FunctionEvaluator');
const ClassEvaluator = require('./ClassEvaluator');
const UtilityEvaluator = require('./UtilityEvaluator');
const GenericEvaluator = require('./GenericEvaluator');

class EvaluatorRegistry {
  constructor() {
    this.evaluators = new Map();
    this.registerDefaultEvaluators();
  }
  
  registerDefaultEvaluators() {
    this.register('function', new FunctionEvaluator());
    this.register('class', new ClassEvaluator());
    this.register('utility', new UtilityEvaluator());
    this.register('generic', new GenericEvaluator());
  }
  
  register(type, evaluator) {
    this.evaluators.set(type, evaluator);
  }
  
  get(type) {
    return this.evaluators.get(type) || this.evaluators.get('generic');
  }
  
  getSupportedTypes() {
    return Array.from(this.evaluators.keys());
  }
  
  hasType(type) {
    return this.evaluators.has(type);
  }
}

module.exports = EvaluatorRegistry;





