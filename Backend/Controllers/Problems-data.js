// Sample Problems for Frontend JavaScript Practice Platform
// Updated with Industry Standard Schema

const problems = [
  {
    "performanceRequirements": {
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "maxExecutionTime": 5000,
      "maxMemoryUsage": 128
    },
    "stats": {
      "totalSubmissions": 0,
      "successfulSubmissions": 0,
      "averageCompletionTime": 0,
      "successRate": 0,
      "difficultyRating": 0
    },
    "problemType": "function",
    "category": "JavaScript",
    "executionEnvironment": "node",
    "validationRules": [
      "no-infinite-loops",
      "no-eval"
    ],
    "testFramework": "jest",
    "version": 1,
    "isActive": true,
    "_id": "68a2bf5241e409e4352575c8",
    "title": "Two Sum",
    "slug": "two-sum",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "requirements": [
      "Find two numbers in the array that add up to the target",
      "Return the indices of these two numbers",
      "Each input has exactly one solution",
      "Cannot use the same element twice",
      "Can return the answer in any order"
    ],
    "difficulty": "Easy",
    "tags": [
      "Array",
      "Hash Table",
      "Two Pointers"
    ],
    "languages": [
      "JavaScript"
    ],
    "functionSignature": "function twoSum(nums, target) {}",
    "starterCode": "/**\n * @param {number[]} nums - Array of integers\n * @param {number} target - Target sum\n * @return {number[]} - Indices of two numbers that add up to target\n */\nfunction twoSum(nums, target) {\n    // Your code here\n}",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists"
    ],
    "sampleTestCases": [
      {
        "name": "Basic Two Sum Test",
        "description": "Tests basic two sum functionality with valid input",
        "input": "nums = [2,7,11,15], target = 9",
        "expectedOutput": "[0,1]",
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1].",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false,
        "_id": "68a2bf5241e409e4352575c9"
      },
      {
        "name": "Two Sum with Different Target",
        "description": "Tests two sum with a different target value",
        "input": "nums = [3,2,4], target = 6",
        "expectedOutput": "[1,2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2].",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false,
        "_id": "68a2bf5241e409e4352575ca"
      }
    ],
    "mainTestCases": [
      {
        "name": "Basic Two Sum Test",
        "description": "Tests basic two sum functionality with valid input",
        "input": "nums = [2,7,11,15], target = 9",
        "expectedOutput": "[0,1]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575cb"
      },
      {
        "name": "Two Sum with Different Target",
        "description": "Tests two sum with a different target value",
        "input": "nums = [3,2,4], target = 6",
        "expectedOutput": "[1,2]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575cc"
      },
      {
        "name": "Main Test 3",
        "description": "",
        "input": "nums = [3,3], target = 6",
        "expectedOutput": "[0,1]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575cd"
      },
      {
        "name": "Main Test 4",
        "description": "",
        "input": "nums = [-1,-2,-3,-4,-5], target = -8",
        "expectedOutput": "[2,4]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575ce"
      },
      {
        "name": "Main Test 5",
        "description": "",
        "input": "nums = [0,4,3,0], target = 0",
        "expectedOutput": "[0,3]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575cf"
      },
      {
        "name": "Main Test 6",
        "description": "",
        "input": "nums = [-3,4,3,90], target = 0",
        "expectedOutput": "[0,2]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d0"
      },
      {
        "name": "Main Test 7",
        "description": "",
        "input": "nums = [1,2], target = 3",
        "expectedOutput": "[0,1]",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d1"
      }
    ],
    "expectedFunctionName": "twoSum",
    "solutionCode": "function twoSum(nums, target) {\\n    const map = new Map();\\n    for (let i = 0; i < nums.length; i++) {\\n        const complement = target - nums[i];\\n        if (map.has(complement)) {\\n            return [map.get(complement), i];\\n        }\\n        map.set(nums[i], i);\\n    }\\n    return [];\\n}",
    "createdAt": "2025-08-18T05:51:14.868Z",
    "__v": 0,
    "edgeCases": [
      {
        "name": "Empty Array",
        "description": "Tests behavior with empty array",
        "input": "nums = [], target = 0",
        "expectedOutput": "[]",
        "testCode": ""
      },
      {
        "name": "No Solution",
        "description": "Tests when no solution exists",
        "input": "nums = [1, 2, 3], target = 10",
        "expectedOutput": "[]",
        "testCode": ""
      }
    ],
    "performanceTests": [
      {
        "name": "Large Array Performance",
        "description": "Tests performance with large array",
        "input": "nums = Array.from({length: 10000}, (_, i) => i), target = 19998",
        "expectedOutput": "[9998, 9999]",
       "maxExecutionTime": 5000,
        "testCode": ""
      }
    ],
    "updatedAt": "2025-08-25T06:34:22.928Z"
  },
  {
    "performanceRequirements": {
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "maxExecutionTime": 5000,
      "maxMemoryUsage": 128
    },
    "stats": {
      "totalSubmissions": 0,
      "successfulSubmissions": 0,
      "averageCompletionTime": 0,
      "successRate": 0,
      "difficultyRating": 0
    },
    "problemType": "function",
    "category": "JavaScript",
    "executionEnvironment": "node",
    "validationRules": [
      "no-infinite-loops",
      "no-eval"
    ],
    "testFramework": "jest",
    "version": 1,
    "isActive": true,
    "_id": "68a2bf5241e409e4352575d2",
    "title": "Valid Parentheses",
    "slug": "valid-parentheses",
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "requirements": [
      "Open brackets must be closed by the same type of brackets",
      "Open brackets must be closed in the correct order",
      "Every close bracket has a corresponding open bracket of the same type"
    ],
    "difficulty": "Easy",
    "tags": [
      "String",
      "Stack",
      "Parsing"
    ],
    "languages": [
      "JavaScript"
    ],
    "functionSignature": "function isValid(s) {}",
    "starterCode": "/**\\n * @param {string} s - String containing brackets\\n * @return {boolean} - True if brackets are valid, false otherwise\\n */\\nfunction isValid(s) {\\n    // Your code here\\n}",
    "constraints": [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    "sampleTestCases": [
      {
        "name": "Simple Parentheses",
        "description": "Tests simple valid parentheses",
        "input": "s = \"()\"",
        "expectedOutput": "true",
        "explanation": "The string contains valid parentheses.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      },
      {
        "name": "Multiple Bracket Types",
        "description": "Tests multiple types of brackets",
        "input": "s = \"()[]{}\"",
        "expectedOutput": "true",
        "explanation": "All brackets are properly matched and nested.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false,
        "_id": "68a2bf5241e409e4352575d4"
      }
    ],
    "mainTestCases": [
      {
        "name": "Simple Parentheses",
        "description": "Tests simple valid parentheses",
        "input": "s = \"()\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Multiple Bracket Types",
        "description": "Tests multiple types of brackets",
        "input": "s = \"()[]{}\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d6"
      },
      {
        "name": "Main Test 3",
        "description": "",
        "input": "s = \"(]\"",
        "expectedOutput": "false",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d7"
      },
      {
        "name": "Main Test 4",
        "description": "",
        "input": "s = \"([)]\"",
        "expectedOutput": "false",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d8"
      },
      {
        "name": "Main Test 5",
        "description": "",
        "input": "s = \"{[]}\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575d9"
      },
      {
        "name": "Main Test 6",
        "description": "",
        "input": "s = \"\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575da"
      },
      {
        "name": "Main Test 7",
        "description": "",
        "input": "s = \"(((\"",
        "expectedOutput": "false",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575db"
      },
      {
        "name": "Main Test 8",
        "description": "",
        "input": "s = \")))\"",
        "expectedOutput": "false",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575dc"
      },
      {
        "name": "Main Test 9",
        "description": "",
        "input": "s = \"(){}[]\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575dd"
      },
      {
        "name": "Main Test 10",
        "description": "",
        "input": "s = \"([{}])\"",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true,
        "_id": "68a2bf5241e409e4352575de"
      }
    ],
    "expectedFunctionName": "isValid",
    "solutionCode": "function isValid(s) {\n    const stack = [];\n    const mapping = {\n        ')': '(',\n        '}': '{',\n        ']': '['\n    };\n\n    for (let char of s) {\n        if (char in mapping) {\n            const topElement = stack.length === 0 ? '#' : stack.pop();\n            if (mapping[char] !== topElement) {\n                return false;\n            }\n        } else {\n            stack.push(char);\n        }\n    }\n\n    return stack.length === 0;\n}",
    "createdAt": "2025-08-18T05:51:14.869Z",
    "__v": 0,
    "edgeCases": [],
    "performanceTests": [],
    "updatedAt": "2025-08-25T06:34:22.930Z"
  },
  {
    "performanceRequirements": {
      "timeComplexity": "O(1)",
      "spaceComplexity": "O(1)",
      "maxExecutionTime": 5000,
      "maxMemoryUsage": 128
    },
    "stats": {
      "totalSubmissions": 0,
      "successfulSubmissions": 0,
      "averageCompletionTime": 0,
      "successRate": 0,
      "difficultyRating": 0
    },
    "problemType": "utility",
    "category": "JavaScript",
    "executionEnvironment": "node",
    "validationRules": [
      "no-infinite-loops",
      "no-eval"
    ],
    "testFramework": "jest",
    "version": 1,
    "isActive": true,
    "_id": "68a2bf5241e409e4352575df",
    "title": "Debounce Function",
    "slug": "debounce-function",
    "description": "Create a debounce function that delays the execution of a function until after a specified delay has passed since the last time it was invoked.",
    "requirements": [
      "Return a debounced version of the provided function",
      "The debounced function should delay execution by the specified delay",
      "If called again before the delay expires, reset the timer",
      "Should preserve the original function's context and arguments",
      "Should return the result of the original function when executed"
    ],
    "difficulty": "Medium",
    "tags": [
      "Function",
      "Closure",
      "Timer",
      "Higher-Order Function"
    ],
    "languages": [
      "JavaScript"
    ],
    "functionSignature": "function debounce(func, delay) {}",
    "starterCode": "/**\n * @param {Function} func - The function to debounce\n * @param {number} delay - The delay in milliseconds\n * @return {Function} - The debounced function\n */\nfunction debounce(func, delay) {\n    // Your code here\n}",
    "constraints": [
      "func is a valid function",
      "delay is a non-negative integer",
      "delay <= 10000 (10 seconds)",
      "The debounced function should work with any number of arguments"
    ],
    "sampleTestCases": [
      {
        "name": "Basic Debounce Functionality",
        "description": "Tests that debounce returns a function that delays execution",
        "input": "Basic debounce functionality test",
        "expectedOutput": "true",
        "explanation": "Tests that debounce returns a function that delays execution by the specified time.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      },
      {
        "name": "Multiple Rapid Calls",
        "description": "Tests that multiple rapid calls are properly debounced",
        "input": "Multiple rapid calls test",
        "expectedOutput": "true",
        "explanation": "Tests that multiple rapid calls are properly debounced and only the last call executes.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      }
    ],
    "mainTestCases": [
      {
        "name": "Basic Debounce Functionality",
        "description": "Tests that debounce returns a function that delays execution",
        "input": "Basic debounce functionality test",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Multiple Rapid Calls",
        "description": "Tests that multiple rapid calls are properly debounced",
        "input": "Multiple rapid calls test",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 3",
        "description": "",
        "input": "Function arguments preservation test",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 4",
        "description": "",
        "input": "Function context preservation test",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 5",
        "description": "",
        "input": "Delay timing accuracy test",
        "expectedOutput": "true",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      }
    ],
    "expectedFunctionName": "debounce",
    "solutionCode": "function debounce(func, delay) {\n    let timeoutId;\n    return function(...args) {\n        const context = this;\n        clearTimeout(timeoutId);\n        timeoutId = setTimeout(() => {\n            func.apply(context, args);\n        }, delay);\n    };\n}",
    "createdAt": "2025-08-18T05:51:14.870Z",
    "__v": 0,
    "edgeCases": [
      {
        "name": "Zero Delay",
        "description": "Tests behavior with zero delay",
        "input": "func = () => 'immediate', delay = 0",
        "expectedOutput": "Function executes immediately",
        "testCode": ""
      },
      {
        "name": "Large Delay",
        "description": "Tests behavior with large delay",
        "input": "func = () => 'delayed', delay = 10000",
        "expectedOutput": "Function executes after 10 seconds",
        "testCode": ""
      }
    ],
    "performanceTests": [
      {
        "name": "Memory Usage Test",
        "description": "Tests that debounce doesn't cause memory leaks",
        "input": "func = () => 'test', delay = 100, iterations = 1000",
        "expectedOutput": "No memory leaks detected",
       "maxExecutionTime": 5000,
        "testCode": ""
      }
    ],
    "updatedAt": "2025-08-25T06:34:22.930Z"
  },
  {
    "performanceRequirements": {
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "maxExecutionTime": 5000,
      "maxMemoryUsage": 128
    },
    "stats": {
      "totalSubmissions": 0,
      "successfulSubmissions": 0,
      "averageCompletionTime": 0,
      "successRate": 0,
      "difficultyRating": 0
    },
    "problemType": "function",
    "category": "JavaScript",
    "executionEnvironment": "node",
    "validationRules": [
      "no-infinite-loops",
      "no-eval"
    ],
    "testFramework": "jest",
    "version": 1,
    "isActive": true,
    "_id": "68a2bf5241e409e4352575e7",
    "title": "Deep Clone Object",
    "slug": "deep-clone-object",
    "description": "Implement a function that creates a deep clone of a JavaScript object, handling nested objects, arrays, and primitive values.",
    "requirements": [
      "Create a complete deep copy of the input object",
      "Handle nested objects and arrays recursively",
      "Preserve primitive values (string, number, boolean, null, undefined)",
      "Handle circular references gracefully",
      "Return a new object that shares no references with the original"
    ],
    "difficulty": "Medium",
    "tags": [
      "Object",
      "Recursion",
      "Deep Copy",
      "Data Structures"
    ],
    "languages": [
      "JavaScript"
    ],
    "functionSignature": "function deepClone(obj) {}",
    "starterCode": "/**\n * @param {any} obj - The object to deep clone\n * @return {any} - A deep clone of the input object\n */\nfunction deepClone(obj) {\n    // Your code here\n}",
    "constraints": [
      "Input can be any valid JavaScript value",
      "Object nesting depth <= 100",
      "Handle Date objects, RegExp, and other built-in objects",
      "Circular references should not cause infinite loops"
    ],
    "sampleTestCases": [
      {
        "name": "Sample Test 1",
        "description": "Creates a deep copy where modifying nested properties doesn't affect the original.",
        "input": "obj = {a: 1, b: {c: 2}}",
        "expectedOutput": "{\"a\": 1, \"b\": {\"c\": 2}}",
        "explanation": "Creates a deep copy where modifying nested properties doesn't affect the original.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      },
      {
        "name": "Sample Test 2",
        "description": "Handles arrays with nested objects and arrays.",
        "input": "obj = [1, [2, 3], {a: 4}]",
        "expectedOutput": "[1, [2, 3], {\"a\": 4}]",
        "explanation": "Handles arrays with nested objects and arrays.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false,
        "_id": "68a2bf5241e409e4352575e9"
      }
    ],
    "mainTestCases": [
      {
        "name": "Main Test 1",
        "description": "",
        "input": "Simple object with primitives",
        "expectedOutput": "Deep copy of object",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 2",
        "description": "",
        "input": "Nested objects",
        "expectedOutput": "Deep copy with nested structure",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 3",
        "description": "",
        "input": "Arrays with objects",
        "expectedOutput": "Deep copy of array structure",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 4",
        "description": "",
        "input": "Mixed nested structures",
        "expectedOutput": "Complete deep copy",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 5",
        "description": "",
        "input": "Object with Date and RegExp",
        "expectedOutput": "Proper cloning of special objects",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      }
    ],
    "expectedFunctionName": "deepClone",
    "solutionCode": "function deepClone(obj) {\n    if (obj === null || typeof obj !== 'object') {\n        return obj;\n    }\n\n    if (obj instanceof Date) {\n        return new Date(obj.getTime());\n    }\n\n    if (obj instanceof RegExp) {\n        return new RegExp(obj);\n    }\n\n    if (Array.isArray(obj)) {\n        return obj.map(item => deepClone(item));\n    }\n\n    const cloned = {};\n    for (let key in obj) {\n        if (obj.hasOwnProperty(key)) {\n            cloned[key] = deepClone(obj[key]);\n        }\n    }\n\n    return cloned;\n}",
    "createdAt": "2025-08-18T05:51:14.870Z",
    "__v": 0,
    "edgeCases": [],
    "performanceTests": [],
    "updatedAt": "2025-08-25T06:34:22.931Z"
  },
  {
    "performanceRequirements": {
      "timeComplexity": "O(n)",
      "spaceComplexity": "O(n)",
      "maxExecutionTime": 5000,
      "maxMemoryUsage": 128
    },
    "stats": {
      "totalSubmissions": 0,
      "successfulSubmissions": 0,
      "averageCompletionTime": 0,
      "successRate": 0,
      "difficultyRating": 0
    },
    "problemType": "class",
    "category": "JavaScript",
    "executionEnvironment": "node",
    "validationRules": [
      "no-infinite-loops",
      "no-eval"
    ],
    "testFramework": "jest",
    "version": 1,
    "isActive": true,
    "_id": "68a2bf5241e409e4352575ef",
    "title": "Event Emitter",
    "slug": "event-emitter",
    "description": "Implement an EventEmitter class that allows subscribing to events, emitting events, and unsubscribing from events.",
    "requirements": [
      "Implement 'on' method to subscribe to events",
      "Implement 'emit' method to trigger events with data",
      "Implement 'off' method to unsubscribe from events",
      "Support multiple listeners for the same event",
      "Pass data to event listeners when emitting",
      "Handle edge cases like removing non-existent listeners"
    ],
    "difficulty": "Medium",
    "tags": [
      "Class",
      "Event Handling",
      "Observer Pattern",
      "Design Patterns"
    ],
    "languages": [
      "JavaScript"
    ],
    "functionSignature": "class EventEmitter {}",
    "starterCode": "/**\n * EventEmitter class for handling custom events\n */\nclass EventEmitter {\n    constructor() {\n        // Your code here\n    }\n\n    /**\n     * Subscribe to an event\n     * @param {string} event - Event name\n     * @param {Function} listener - Event listener function\n     */\n    on(event, listener) {\n        // Your code here\n    }\n\n    /**\n     * Emit an event with optional data\n     * @param {string} event - Event name\n     * @param {...any} args - Arguments to pass to listeners\n     */\n    emit(event, ...args) {\n        // Your code here\n    }\n\n    /**\n     * Unsubscribe from an event\n     * @param {string} event - Event name\n     * @param {Function} listener - Event listener function to remove\n     */\n    off(event, listener) {\n        // Your code here\n    }\n}",
    "constraints": [
      "Event names are non-empty strings",
      "Listeners are valid functions",
      "Support unlimited number of events and listeners",
      "Emit should call listeners in the order they were added",
      "Off should only remove the specific listener function"
    ],
    "sampleTestCases": [
      {
        "name": "Sample Test 1",
        "description": "Basic event subscription and emission.",
        "input": "emitter.on('test', callback); emitter.emit('test', 'data');",
        "expectedOutput": "callback called with 'data'",
        "explanation": "Basic event subscription and emission.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      },
      {
        "name": "Sample Test 2",
        "description": "Supports multiple listeners per event.",
        "input": "Multiple listeners for same event",
        "expectedOutput": "All listeners called in order",
        "explanation": "Supports multiple listeners per event.",
        "testCode": "",
        "timeout": 5000,
        "isHidden": false
      }
    ],
    "mainTestCases": [
      {
        "name": "Main Test 1",
        "description": "",
        "input": "Basic on/emit functionality",
        "expectedOutput": "Event listener called correctly",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 2",
        "description": "",
        "input": "Multiple listeners for same event",
        "expectedOutput": "All listeners executed",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 3",
        "description": "",
        "input": "Emit with multiple arguments",
        "expectedOutput": "All arguments passed to listeners",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 4",
        "description": "",
        "input": "Remove specific listener with off",
        "expectedOutput": "Only specified listener removed",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      },
      {
        "name": "Main Test 5",
        "description": "",
        "input": "Emit event with no listeners",
        "expectedOutput": "No errors, graceful handling",
        "explanation": "",
        "testCode": "",
        "timeout": 5000,
        "isHidden": true
      }
    ],
    "expectedFunctionName": "EventEmitter",
    "solutionCode": "class EventEmitter {\n    constructor() {\n        this.events = {};\n    }\n\n    on(event, listener) {\n        if (!this.events[event]) {\n            this.events[event] = [];\n        }\n        this.events[event].push(listener);\n    }\n\n    emit(event, ...args) {\n        if (this.events[event]) {\n            this.events[event].forEach(listener => {\n                listener(...args);\n            });\n        }\n    }\n\n    off(event, listenerToRemove) {\n        if (this.events[event]) {\n            this.events[event] = this.events[event].filter(\n                listener => listener !== listenerToRemove\n            );\n        }\n    }\n}",
    "createdAt": "2025-08-18T05:51:14.871Z",
    "__v": 0,
    "edgeCases": [],
    "performanceTests": [],
    "updatedAt": "2025-08-25T06:34:22.932Z"
  }
];

module.exports = problems;
