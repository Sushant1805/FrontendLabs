# FrontendLabs

A learning platform for frontend and algorithm practice with an execution sandbox for running user-submitted code (Node/Jest based). This repository contains both the `Frontend` (Vite + React) UI and the `Backend` API and executor used to run and validate submitted problems.

## Quick overview

- `Frontend/` — React app, UI for problem browsing, submission, auth, and coding screen.
- `Backend/` — Express server, problem models, controllers, and execution tooling.
  - `Backend/docker-executor/` — sandboxed executor image and `executor.js` used inside the Docker container (runs Jest tests against user code).
  - `Backend/executors/` — local evaluators (Function, Class, Generic) and `BaseEvaluator` used for fallback/local execution.
  - `Backend/Controllers/` — controllers that orchestrate execution and selection of test cases.

## Files of interest

- `Backend/Controllers/universal-execution-controller.js` — main orchestration for execution requests.
- `Backend/Controllers/execution-controller.js` — simpler execution controller and example docker invocation.
- `Backend/docker-executor/executor.js` — code that runs inside the `code-executor` image. It decodes base64 args, constructs a Jest test file, runs Jest, and prints a JSON result.
- `Backend/docker-executor/Dockerfile` — builds the `code-executor` image; installs Node and Jest and sets resource limits.
- `Backend/executors/BaseEvaluator.js` — local file-based executor used by `FunctionEvaluator` and `GenericEvaluator`.
- `Backend/executors/FunctionEvaluator.js` and `GenericEvaluator.js` — wrappers that build test harnesses and call `BaseEvaluator.runTest`.
- `Backend/Models/problems-model.js` — Mongoose model for problems (used when `problemId` is provided).
- `Frontend/` — Vite React app (open `Frontend/README.md` for frontend-specific details).

## Running the project (development)

Prerequisites: Node.js 18+, npm, Docker (optional for sandboxed execution)

1. Install dependencies for Backend and Frontend:

```powershell
# from repo root
cd Backend
npm install

cd ..\Frontend
npm install
```

2. Start backend (development):

```powershell
# from Backend/
npm run dev     # or: node server.js (depending on your scripts)
```

3. Start frontend (development):

```powershell
# from Frontend/
npm run dev
# then open the dev server URL (Vite prints it)
```

## How code execution works (high-level)

1. Client calls POST `/api/execute/code` (router: `Backend/router/execution-router.js`).
2. Controller (`universal-execution-controller`) validates request, fetches problem details (if problemId provided), selects test cases (sample/main/performance/edge) and calls `executeInSandbox` for each test case.
3. `executeInSandbox` tries Docker first (`executeInDocker`) and falls back to local execution (`executeLocally`) if Docker isn't available.
4. Docker path: `code-executor` runs `node executor.js <base64(code)> <base64(timeout)> <base64(testCase)> <base64(problemType)>`. Inside the container the script builds a Jest test file and runs `jest --json --outputFile=...` and prints a structured JSON summary to stdout.
5. Local evaluator path: `BaseEvaluator` / `FunctionEvaluator` create temp files and run `node` directly, expecting the test harness to `console.log(JSON.stringify({ success, result }))` which the evaluator parses.

## Adding or editing problems

Problems are stored in the DB via the `problem` model. A problem JSON typically contains:

- `title`, `slug`, `description`
- `problemType` (e.g., `function`, `class`, `react-component`)
- `expectedFunctionName` (used by server-side validation)
- `sampleTestCases`, `mainTestCases`, `performanceTests`, `edgeCases` — each test case should include a `testCode` field containing the Jest-style assertions to run against the user code.

Important: always include a non-empty `testCode` string in test case objects. The executor expects `testCase.testCode` to be valid JS test assertions (e.g. `const res = isValid('()'); expect(res).toBe(true);`).

## Enabling DOM / browser-like tests

By default the Docker executor's Jest environment is `node`. To support DOM-related tests you have two options:

1. Lightweight (jsdom)
   - Install `jsdom` and set Jest environment to `jsdom` in `jest.config.json` used by the executor image.
   - Update `Backend/docker-executor/Dockerfile` to `npm install --save-dev jest jsdom` and create `jest.config.json` containing:

```json
{ "testEnvironment": "jsdom", "testMatch": ["**/*.test.js"] }
```

   - This supports typical DOM manipulation tests (document/window, event handling) but not full browser rendering (Canvas, WebGL).

2. Full browser (Puppeteer / Playwright)
   - Bake `puppeteer` into the execution image and write a small harness that launches headless Chrome to run user code and tests.
   - Requires larger image, more memory/time, and additional sandboxing considerations.

If you want, I can implement the jsdom option (Dockerfile + local evaluator injection) for you.

## Security and resource notes

- Containers are run with flags to limit resources: `--memory=128m`, `--cpus=0.5`, `--network=none`, `--user 1001:1001` — adjust as necessary for heavier tests.
- Validation rules like `no-eval` and `no-infinite-loops` are checked server-side but are not bulletproof; you should still run untrusted code inside containers with strict limits.
- Temp files are used for execution; ensure permissions and cleanup policies are acceptable in your deployment.

## Troubleshooting tips

- "No test code provided" in test output: ensure `testCase.testCode` is non-empty; the executor now surfaces missing testCode as a failing test so you can spot the issue quickly.
- Jest not found inside container: ensure the Docker image is rebuilt (`docker build -t code-executor Backend/docker-executor`) and that `jest` is installed in the image.
- Tests time out: increase `maxExecutionTime` for performance tests or increase `timeout` when calling the executor.

## Development notes

- Local fallback uses `Backend/executors/*`. These evaluators have a custom `expect` shim that returns structured JSON. If you change test formats, update both Docker executor (Jest) and local evaluators accordingly.
- Keep test-case format consistent (Jest-style assertions) so both runner paths behave the same.

## Contributor guide

- Feature branches: `feature/<desc>`
- Commit messages: short imperative style
- Open a PR for significant changes and include tests when possible.

## License

MIT

---

