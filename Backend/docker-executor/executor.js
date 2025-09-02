#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Create temp directory for execution
const tempDir = path.join(os.tmpdir(), 'execution');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Get input from command line arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node executor.js <code> <timeout> <testCase>');
  process.exit(1);
}

// Try to decode base64 arguments, fall back to plain text if decoding fails
let userCode, timeout, testCase, problemType;

try {
  userCode = JSON.parse(Buffer.from(args[0], 'base64').toString('utf8'));
} catch (e) {
  userCode = args[0];
}

try {
  timeout = JSON.parse(Buffer.from(args[1], 'base64').toString('utf8'));
} catch (e) {
  timeout = parseInt(args[1]) || 5000;
}

try {
  testCase = JSON.parse(Buffer.from(args[2], 'base64').toString('utf8'));
} catch (e) {
  try {
    testCase = JSON.parse(args[2]);
  } catch (e2) {
    testCase = {
      name: "Test Case",
      testCode: "// No specific test code provided",
      timeout: 5000
    };
  }
}

try {
  problemType = JSON.parse(Buffer.from(args[3] || '', 'base64').toString('utf8'));
} catch (e) {
  problemType = 'function';
}

// Clean up the test case object
if (typeof testCase === 'string') {
  testCase = {
    name: "Test Case",
    testCode: testCase,
    timeout: 5000
  };
}
if (!testCase.name) testCase.name = "Test Case";
if (!testCase.testCode) testCase.testCode = "// No specific test code provided";
if (!testCase.timeout) testCase.timeout = timeout || 5000;

// If testCode is just the default placeholder or empty, replace it with an explicit failing test
// that makes the cause obvious in the Jest failure output.
if (!testCase.testCode || testCase.testCode.trim() === "// No specific test code provided" || testCase.testCode.trim() === '') {
  const missingName = testCase.name ? testCase.name.replace(/'/g, "\\'") : 'Unnamed Test Case';
  testCase.testCode = `throw new Error('No testCode provided for test case: ${missingName}');`;
}

// --- JEST EXECUTION LOGIC ONLY BELOW ---

async function executeCodeWithJest() {
  try {
    // Write test code to temp Jest test file
    const testFile = path.join(tempDir, `userCode_${Date.now()}.test.js`);
    const jestTestCode = `
${userCode}

describe('${testCase.name || 'Test Case'}', () => {
  test('${testCase.description || 'Code execution test'}', () => {
    ${testCase.testCode}
  });
});
`;
    console.error('User code:', userCode);
    console.error('Test code:', testCase.testCode);
    console.error('Combined test file content:', jestTestCode);
    fs.writeFileSync(testFile, jestTestCode);
    
    // Copy Jest config to temp directory
    const jestConfigPath = path.join(__dirname, 'jest.config.json');
    if (fs.existsSync(jestConfigPath)) {
      const tempJestConfig = path.join(tempDir, 'jest.config.json');
      fs.copyFileSync(jestConfigPath, tempJestConfig);
      console.error('Jest config copied to temp directory');
    }

    // Run Jest CLI on the test file and write a JSON report so we can return full details
    let jestResult = '';
    let pass = false;
    let errorMsg = '';
    let rawStdout = '';
    let rawStderr = '';
    let jestReport = null;
    try {
      // First check if Jest exists (best-effort)
      try {
        execSync('ls -la node_modules/.bin/', { cwd: tempDir, stdio: 'pipe' });
        console.error('Jest binary check passed');
      } catch (checkError) {
        console.error('Jest binary check failed:', checkError.message);
      }

      const reportPath = path.join(tempDir, 'jest-report.json');
      const jestCommand = `jest --runInBand --json --outputFile=${reportPath} ${testFile}`;
      console.error('Running Jest command:', jestCommand);

      try {
        const execOpts = {
          cwd: tempDir,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'pipe'],
          maxBuffer: 5 * 1024 * 1024
        };
        jestResult = execSync(jestCommand, execOpts);
        rawStdout = jestResult || '';
      } catch (execErr) {
        // execSync throws when jest exits non-zero (test failures). Capture stdout/stderr
        rawStdout = execErr.stdout ? execErr.stdout.toString() : '';
        rawStderr = execErr.stderr ? execErr.stderr.toString() : execErr.message;
        console.error('Jest exec error captured. stdout length:', rawStdout.length, 'stderr length:', rawStderr.length);
      }

      // If the report exists, read it
      if (fs.existsSync(reportPath)) {
        try {
          const reportRaw = fs.readFileSync(reportPath, 'utf8');
          jestReport = JSON.parse(reportRaw);
          pass = !!jestReport.success;
          console.error('Jest report read, success=', pass);
        } catch (rErr) {
          console.error('Failed to read/parse jest report:', rErr.message);
        }
      } else {
        console.error('Jest report not found at', reportPath);
      }

      // If no JSON report, but stdout contains indicators, try to infer pass/fail
      if (jestReport === null) {
        const combined = (rawStdout || '') + '\n' + (rawStderr || '');
        if (/\bFAIL\b|failed|Test Suites:.*failed|Test.*failed/i.test(combined)) {
          pass = false;
        } else if (/All tests passed|passed\s+\d+\s+tests/i.test(combined)) {
          pass = true;
        }
      }

      // Build a useful error message/received output for the UI
      if (pass) {
        errorMsg = '';
      } else {
        // Prefer structured report details if available
        if (jestReport) {
          // Provide number summary and first few failures
          const summary = `Passed: ${jestReport.numPassedTests} / ${jestReport.numTotalTests} tests`;
          const failures = [];
          (jestReport.testResults || []).forEach(tr => {
            (tr.assertionResults || []).forEach(ar => {
                if (ar.status === 'failed') {
                  // Build a concise summary for common Jest failure messages
                  const fm = (ar.failureMessages || []).join('\n');
                  let summary = '';

                  try {
                    // Try to extract Expected/Received lengths
                    const expectedMatch = fm.match(/Expected(?: length)?:\s*([0-9]+)/i) || fm.match(/Expected:\s*([0-9]+)/i);
                    const receivedMatch = fm.match(/Received(?: length)?:\s*([0-9]+)/i) || fm.match(/Received:\s*([0-9]+)/i);
                    const receivedArrayMatch = fm.match(/Received:\s*(\[[\s\S]*?\])/i);

                    if (expectedMatch) summary += `Expected length: ${expectedMatch[1]}\n`;
                    if (receivedMatch) summary += `Received length: ${receivedMatch[1]}\n`;
                    if (receivedArrayMatch) {
                      // normalize whitespace inside array
                      const arr = receivedArrayMatch[1].replace(/\s+/g, ' ').replace(/\s+,/g, ',');
                      summary += `Received array: ${arr}\n`;
                    }
                  } catch (e) {
                    // ignore parsing errors
                  }

                  failures.push({ fullName: ar.fullName, title: ar.title, failureMessages: ar.failureMessages, summary: summary.trim() });
              }
            });
          });
          errorMsg = summary + (failures.length ? '\nFailures:\n' + failures.slice(0, 3).map(f => `${f.fullName}: ${f.failureMessages.join('\n')}`).join('\n---\n') : '\n(No detailed failure messages)');
        } else {
          // Fallback to raw stdout/stderr
          const combined = (rawStdout || '').trim() + '\n' + (rawStderr || '').trim();
          errorMsg = combined.trim() || 'Test execution failed (no additional output)';
        }
      }
    } catch (err) {
      console.error('Unexpected error running Jest:', err);
      pass = false;
      errorMsg = err.message || 'Unexpected execution error';
    }

    // Clean up temp files
    try { fs.unlinkSync(testFile); } catch (e) {}

    // Prepare structured output for the UI
    let failuresArray = [];
    if (jestReport) {
      (jestReport.testResults || []).forEach(tr => {
        (tr.assertionResults || []).forEach(ar => {
          if (ar.status === 'failed') {
            failuresArray.push({ fullName: ar.fullName, title: ar.title, failureMessages: ar.failureMessages });
          }
        });
      });
    }

    const rawCombined = (rawStdout || '').trim() + '\n' + (rawStderr || '').trim();

    // Output result with structured fields: received (summary), failures (array) and raw (full output)
    console.log(JSON.stringify({
      name: testCase.name || 'Jest Test',
      input: testCase.description || 'Jest code execution test',
      expected: 'All tests passed',
      // If tests passed, show success; if failed, leave 'received' empty (frontend shows failures instead)
      received: pass ? 'All tests passed' : '',
      pass,
      // provide structured failures for the frontend to render neatly
      failures: failuresArray,
      // provide full raw stdout/stderr for advanced debugging
      raw: rawCombined
    }));
  } catch (error) {
    console.log(JSON.stringify({
      error: "Execution Error",
      message: error.message,
      pass: false
    }));
  }
}

// Run the Jest executor
executeCodeWithJest();
