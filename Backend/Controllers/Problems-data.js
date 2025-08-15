// Problems-data.js
module.exports = [
  {
    title: "Debounce Function",
    slug: "debounce-function",
    description: `Implement a browser-compatible debounce utility function.

A **debounce** function ensures that a given function is executed only after a certain amount of time has passed since it was last called.

**Requirements:**
1. The returned function should delay execution until after \`wait\` ms have passed since the last call.
2. Should work in browser environments.
3. Preserve \`this\` context and arguments.`,
    difficulty: "easy",
    functionSignature: "function debounce(fn, wait) {}",
    expectedFunctionName: "debounce",
    starterCode: `/**
 * Creates a debounced version of a function
 * @param {Function} fn - The function to debounce
 * @param {number} wait - Time in milliseconds to delay
 * @returns {Function} A debounced function
 */
function debounce(fn, wait) {
  // your code here
}`,
    solutionCode: `function debounce(fn, wait) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}`,
    editorial: `We store the timeout ID and reset it on each call. The function only runs after no calls are made within the wait time.`,
    mainTestCases: [
      {
        input: [
          `(() => {
            let calls = [];
            const fn = () => calls.push(Date.now());
            const debounced = debounce(fn, 100);
            debounced();
            debounced();
            setTimeout(() => {
              debounced();
            }, 50);
            setTimeout(() => {
              console.log(calls.length);
            }, 200);
          })()`
        ],
        output: ["1"]
      }
    ],
    sampleTestCases: [
      {
        input: "debounce(() => console.log('Hi'), 200)();",
        output: "Hi",
        explanation: "Runs after 200ms."
      },
      {
        input: "const d = debounce(() => console.log('Hi'), 200); d(); d();",
        output: "Hi",
        explanation: "Only runs once after last call."
      }
    ]
  },

  {
    title: "Throttle Function",
    slug: "throttle-function",
    description: `Implement a throttle utility function.

A **throttle** function ensures that the given function is executed at most once every \`wait\` milliseconds.

**Requirements:**
1. Calls within the wait period are ignored.
2. Preserve \`this\` context and arguments.`,
    difficulty: "easy",
    functionSignature: "function throttle(fn, wait) {}",
    expectedFunctionName: "throttle",
    starterCode: `/**
 * Creates a throttled version of a function
 * @param {Function} fn - The function to throttle
 * @param {number} wait - Minimum time between calls
 * @returns {Function} A throttled function
 */
function throttle(fn, wait) {
  // your code here
}`,
    solutionCode: `function throttle(fn, wait) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}`,
    editorial: `Throttle tracks the last execution time and ignores calls until wait ms have passed.`,
    mainTestCases: [
      {
        input: [
          `(() => {
            let calls = 0;
            const fn = () => calls++;
            const throttled = throttle(fn, 100);
            throttled();
            throttled();
            setTimeout(throttled, 50);
            setTimeout(() => console.log(calls), 200);
          })()`
        ],
        output: ["1"]
      }
    ],
    sampleTestCases: [
      {
        input: "throttle(() => console.log('Hi'), 100)();",
        output: "Hi",
        explanation: "Runs immediately."
      },
      {
        input: "const t = throttle(() => console.log('Hi'), 100); t(); t();",
        output: "Hi",
        explanation: "Second call within wait period ignored."
      }
    ]
  },

  {
    title: "Once Function",
    slug: "once-function",
    description: `Implement a \`once\` function that ensures the given function is only called once.

**Requirements:**
1. First call executes the function and stores its result.
2. Subsequent calls return the stored result.`,
    difficulty: "easy",
    functionSignature: "function once(fn) {}",
    expectedFunctionName: "once",
    starterCode: `/**
 * Returns a function that can be called only once
 * @param {Function} fn - Function to wrap
 * @returns {Function}
 */
function once(fn) {
  // your code here
}`,
    solutionCode: `function once(fn) {
  let called = false;
  let result;
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}`,
    editorial: `We use a closure to track if the function has been called before and store the result.`,
    mainTestCases: [
      {
        input: [
          `(() => {
            let calls = 0;
            const fn = () => ++calls;
            const o = once(fn);
            o();
            o();
            console.log(calls);
          })()`
        ],
        output: ["1"]
      }
    ],
    sampleTestCases: [
      {
        input: "const o = once(() => console.log('Run')); o(); o();",
        output: "Run",
        explanation: "Second call ignored."
      },
      {
        input: "const o = once(() => 5); console.log(o()); console.log(o());",
        output: "5\n5",
        explanation: "Returns stored result."
      }
    ]
  },

  {
    title: "Memoize Function",
    slug: "memoize-function",
    description: `Implement a \`memoize\` function.

**Requirements:**
1. Cache results for same arguments.
2. Preserve \`this\` context.`,
    difficulty: "medium",
    functionSignature: "function memoize(fn) {}",
    expectedFunctionName: "memoize",
    starterCode: `/**
 * Memoizes a function's results
 * @param {Function} fn - The function to memoize
 * @returns {Function}
 */
function memoize(fn) {
  // your code here
}`,
    solutionCode: `function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
    editorial: `Memoization stores results keyed by argument serialization for faster subsequent calls.`,
    mainTestCases: [
      {
        input: [
          `(() => {
            let calls = 0;
            const square = memoize((x) => { calls++; return x*x; });
            square(2);
            square(2);
            console.log(calls);
          })()`
        ],
        output: ["1"]
      }
    ],
    sampleTestCases: [
      {
        input: "const m = memoize((n) => n*n); console.log(m(2)); console.log(m(2));",
        output: "4\n4",
        explanation: "Second call from cache."
      },
      {
        input: "const m = memoize((a, b) => a+b); console.log(m(1,2)); console.log(m(1,2));",
        output: "3\n3",
        explanation: "Sum computed only once."
      }
    ]
  },

  {
    title: "Deep Clone",
    slug: "deep-clone",
    description: `Implement a deep clone function for JavaScript objects and arrays.

**Requirements:**
1. Works with nested objects and arrays.
2. Handles primitives, objects, and arrays.
3. Should not use \`structuredClone\` or JSON methods.`,
    difficulty: "medium",
    functionSignature: "function deepClone(value) {}",
    expectedFunctionName: "deepClone",
    starterCode: `/**
 * Deeply clones a value
 * @param {*} value - The value to clone
 * @returns {*} A deep clone of the value
 */
function deepClone(value) {
  // your code here
}`,
    solutionCode: `function deepClone(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(deepClone);
  const result = {};
  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      result[key] = deepClone(value[key]);
    }
  }
  return result;
}`,
    editorial: `We recursively copy arrays and objects, ensuring references are not shared.`,
    mainTestCases: [
      {
        input: [
          `(() => {
            const obj = {a:1, b:{c:2}};
            const copy = deepClone(obj);
            copy.b.c = 3;
            console.log(obj.b.c);
          })()`
        ],
        output: ["2"]
      }
    ],
    sampleTestCases: [
      {
        input: "const a = [1, [2, 3]]; const b = deepClone(a); b[1][0] = 99; console.log(a[1][0]);",
        output: "2",
        explanation: "Nested array unaffected."
      },
      {
        input: "const obj = {x: {y: 1}}; const copy = deepClone(obj); copy.x.y = 9; console.log(obj.x.y);",
        output: "1",
        explanation: "Original object remains unchanged."
      }
    ]
  }
];
