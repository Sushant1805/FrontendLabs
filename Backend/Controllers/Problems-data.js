// Sample Problems for Frontend JavaScript Practice Platform

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
    requirements: [
      "Find two numbers in the array that add up to the target",
      "Return the indices of these two numbers",
      "Each input has exactly one solution",
      "Cannot use the same element twice",
      "Can return the answer in any order"
    ],
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "Two Pointers"],
    languages: ["JavaScript"],
    functionSignature: "function twoSum(nums, target) {}",
    starterCode: `/**
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Indices of two numbers that add up to target
 */
function twoSum(nums, target) {
    // Your code here
}`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists"
    ],
    sampleTestCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    mainTestCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]"
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      },
      {
        input: "nums = [-1,-2,-3,-4,-5], target = -8",
        output: "[2,4]"
      },
      {
        input: "nums = [0,4,3,0], target = 0",
        output: "[0,3]"
      },
      {
        input: "nums = [-3,4,3,90], target = 0",
        output: "[0,2]"
      },
      {
        input: "nums = [1,2], target = 3",
        output: "[0,1]"
      }
    ],
    expectedFunctionName: "twoSum",
    solutionCode: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
  },

  {
    title: "Valid Parentheses",
    slug: "valid-parentheses", 
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.`,
    requirements: [
      "Open brackets must be closed by the same type of brackets",
      "Open brackets must be closed in the correct order",
      "Every close bracket has a corresponding open bracket of the same type"
    ],
    difficulty: "Easy",
    tags: ["String", "Stack", "Parsing"],
    languages: ["JavaScript"],
    functionSignature: "function isValid(s) {}",
    starterCode: `/**
 * @param {string} s - String containing brackets
 * @return {boolean} - True if brackets are valid, false otherwise
 */
function isValid(s) {
    // Your code here
}`,
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    sampleTestCases: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "The string contains valid parentheses."
      },
      {
        input: 's = "()[]{}"',
        output: "true", 
        explanation: "All brackets are properly matched and nested."
      }
    ],
    mainTestCases: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      },
      {
        input: 's = "([)]"',
        output: "false"
      },
      {
        input: 's = "{[]}"',
        output: "true"
      },
      {
        input: 's = ""',
        output: "true"
      },
      {
        input: 's = "((("',
        output: "false"
      },
      {
        input: 's = ")))"',
        output: "false"
      },
      {
        input: 's = "(){}[]"',
        output: "true"
      },
      {
        input: 's = "([{}])"',
        output: "true"
      }
    ],
    expectedFunctionName: "isValid",
    solutionCode: `function isValid(s) {
    const stack = [];
    const mapping = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let char of s) {
        if (char in mapping) {
            const topElement = stack.length === 0 ? '#' : stack.pop();
            if (mapping[char] !== topElement) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }

    return stack.length === 0;
}`
  },

  {
    title: "Debounce Function",
    slug: "debounce-function",
    description: `Create a debounce function that delays the execution of a function until after a specified delay has passed since the last time it was invoked.`,
    requirements: [
      "Return a debounced version of the provided function",
      "The debounced function should delay execution by the specified delay",
      "If called again before the delay expires, reset the timer",
      "Should preserve the original function's context and arguments",
      "Should return the result of the original function when executed"
    ],
    difficulty: "Medium",
    tags: ["Function", "Closure", "Timer", "Higher-Order Function"],
    languages: ["JavaScript"],
    functionSignature: "function debounce(func, delay) {}",
    starterCode: `/**
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @return {Function} - The debounced function
 */
function debounce(func, delay) {
    // Your code here
}`,
    constraints: [
      "func is a valid function",
      "delay is a non-negative integer",
      "delay <= 10000 (10 seconds)",
      "The debounced function should work with any number of arguments"
    ],
    sampleTestCases: [
      {
        input: "debounce(() => console.log('Hello'), 100)",
        output: "Function that delays execution by 100ms",
        explanation: "Returns a debounced version that waits 100ms before executing."
      },
      {
        input: "Multiple rapid calls within delay period",
        output: "Only the last call executes after delay",
        explanation: "Previous calls are cancelled when new calls are made."
      }
    ],
    mainTestCases: [
      {
        input: "Basic debounce with 100ms delay",
        output: "Function executes after delay"
      },
      {
        input: "Multiple calls within delay period",
        output: "Only last call executes"
      },
      {
        input: "Calls with different arguments",
        output: "Last call's arguments are used"
      },
      {
        input: "Function with return value",
        output: "Return value is preserved"
      },
      {
        input: "Function with context (this)",
        output: "Context is preserved"
      }
    ],
    expectedFunctionName: "debounce",
    solutionCode: `function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}`
  },

  {
    title: "Deep Clone Object",
    slug: "deep-clone-object",
    description: `Implement a function that creates a deep clone of a JavaScript object, handling nested objects, arrays, and primitive values.`,
    requirements: [
      "Create a complete deep copy of the input object",
      "Handle nested objects and arrays recursively",
      "Preserve primitive values (string, number, boolean, null, undefined)",
      "Handle circular references gracefully",
      "Return a new object that shares no references with the original"
    ],
    difficulty: "Medium",
    tags: ["Object", "Recursion", "Deep Copy", "Data Structures"],
    languages: ["JavaScript"],
    functionSignature: "function deepClone(obj) {}",
    starterCode: `/**
 * @param {any} obj - The object to deep clone
 * @return {any} - A deep clone of the input object
 */
function deepClone(obj) {
    // Your code here
}`,
    constraints: [
      "Input can be any valid JavaScript value",
      "Object nesting depth <= 100",
      "Handle Date objects, RegExp, and other built-in objects",
      "Circular references should not cause infinite loops"
    ],
    sampleTestCases: [
      {
        input: "obj = {a: 1, b: {c: 2}}",
        output: "{a: 1, b: {c: 2}}",
        explanation: "Creates a deep copy where modifying nested properties doesn't affect the original."
      },
      {
        input: "obj = [1, [2, 3], {a: 4}]",
        output: "[1, [2, 3], {a: 4}]",
        explanation: "Handles arrays with nested objects and arrays."
      }
    ],
    mainTestCases: [
      {
        input: "Simple object with primitives",
        output: "Deep copy of object"
      },
      {
        input: "Nested objects",
        output: "Deep copy with nested structure"
      },
      {
        input: "Arrays with objects",
        output: "Deep copy of array structure"
      },
      {
        input: "Mixed nested structures",
        output: "Complete deep copy"
      },
      {
        input: "Object with Date and RegExp",
        output: "Proper cloning of special objects"
      }
    ],
    expectedFunctionName: "deepClone",
    solutionCode: `function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }

    const cloned = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }

    return cloned;
}`
  },

  {
    title: "Event Emitter",
    slug: "event-emitter",
    description: `Implement an EventEmitter class that allows subscribing to events, emitting events, and unsubscribing from events.`,
    requirements: [
      "Implement 'on' method to subscribe to events",
      "Implement 'emit' method to trigger events with data",
      "Implement 'off' method to unsubscribe from events",
      "Support multiple listeners for the same event",
      "Pass data to event listeners when emitting",
      "Handle edge cases like removing non-existent listeners"
    ],
    difficulty: "Medium",
    tags: ["Class", "Event Handling", "Observer Pattern", "Design Patterns"],
    languages: ["JavaScript"],
    functionSignature: "class EventEmitter {}",
    starterCode: `/**
 * EventEmitter class for handling custom events
 */
class EventEmitter {
    constructor() {
        // Your code here
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} listener - Event listener function
     */
    on(event, listener) {
        // Your code here
    }

    /**
     * Emit an event with optional data
     * @param {string} event - Event name
     * @param {...any} args - Arguments to pass to listeners
     */
    emit(event, ...args) {
        // Your code here
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} listener - Event listener function to remove
     */
    off(event, listener) {
        // Your code here
    }
}`,
    constraints: [
      "Event names are non-empty strings",
      "Listeners are valid functions",
      "Support unlimited number of events and listeners",
      "Emit should call listeners in the order they were added",
      "Off should only remove the specific listener function"
    ],
    sampleTestCases: [
      {
        input: "emitter.on('test', callback); emitter.emit('test', 'data');",
        output: "callback called with 'data'",
        explanation: "Basic event subscription and emission."
      },
      {
        input: "Multiple listeners for same event",
        output: "All listeners called in order",
        explanation: "Supports multiple listeners per event."
      }
    ],
    mainTestCases: [
      {
        input: "Basic on/emit functionality",
        output: "Event listener called correctly"
      },
      {
        input: "Multiple listeners for same event",
        output: "All listeners executed"
      },
      {
        input: "Emit with multiple arguments",
        output: "All arguments passed to listeners"
      },
      {
        input: "Remove specific listener with off",
        output: "Only specified listener removed"
      },
      {
        input: "Emit event with no listeners",
        output: "No errors, graceful handling"
      }
    ],
    expectedFunctionName: "EventEmitter",
    solutionCode: `class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => {
                listener(...args);
            });
        }
    }

    off(event, listenerToRemove) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(
                listener => listener !== listenerToRemove
            );
        }
    }
}`
  }
];

module.exports = problems;
