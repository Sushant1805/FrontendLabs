const express = require('express');
const bodyParser = require('body-parser');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

const EXECUTOR_SCRIPT = path.join(__dirname, 'executor.js');
const DEFAULT_TIMEOUT_MS = parseInt(process.env.EXECUTOR_TIMEOUT_MS || '10000', 10);
const DEFAULT_NODE_MAXBUFFER = parseInt(process.env.EXECUTOR_MAXBUFFER || String(5 * 1024 * 1024), 10);

app.post('/execute', (req, res) => {
  const { code, testCase, timeout = 5000, problemType = 'function' } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Invalid code', message: 'code is required and must be a string', pass: false });
  }

  const args = [
    Buffer.from(JSON.stringify(code)).toString('base64'),
    Buffer.from(JSON.stringify(timeout)).toString('base64'),
    Buffer.from(JSON.stringify(testCase || {})).toString('base64'),
    Buffer.from(JSON.stringify(problemType)).toString('base64')
  ];

  const execOpts = {
    timeout: DEFAULT_TIMEOUT_MS,
    maxBuffer: DEFAULT_NODE_MAXBUFFER,
    encoding: 'utf8'
  };

  execFile('node', [EXECUTOR_SCRIPT, ...args], execOpts, (err, stdout, stderr) => {
    if (err) {
      // If the executor printed valid JSON before failing, try to parse it
      if (stdout) {
        try {
          const parsed = JSON.parse(stdout.trim());
          return res.json(parsed);
        } catch (e) {
          return res.status(500).json({ error: 'Execution error', message: stderr || err.message, pass: false });
        }
      }
      return res.status(500).json({ error: 'Execution error', message: stderr || err.message, pass: false });
    }

    try {
      const out = stdout.trim();
      if (!out) return res.status(500).json({ error: 'No output from executor', pass: false });
      const parsed = JSON.parse(out);
      return res.json(parsed);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse executor output', message: parseErr.message, raw: stdout + '\n' + stderr });
    }
  });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.error(`HTTP executor listening on port ${port}`);
});
