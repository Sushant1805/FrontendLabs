# Docker Code Executor

This document shows how to build and run the Docker-based code executor located in `docker-executor`.

## Build the image

Run from the `Backend` folder:

```
npm run executor:build
```

Or directly with Docker:

```
docker build -t frontendlabs-executor:latest ./docker-executor
```

## Run the container (interactive)

Runs the container and mounts `/tmp/execution` so test artifacts are accessible on the host.

```
npm run executor:run
```

Run detached:

```
npm run executor:run-detached
```

Stop & remove container:

```
npm run executor:rm
```

View logs:

```
npm run executor:logs
```

## Execute a sample test inside the image

The `executor.js` expects three arguments: `<code> <timeout> <testCase>` (optionally base64-encoded). Example using Node to create base64 payloads (POSIX shell):

```bash
CODE_B64=$(node -e "console.log(Buffer.from('function sum(a,b){return a+b;}').toString('base64'))")
TIME_B64=$(node -e "console.log(Buffer.from('5000').toString('base64'))")
TEST_B64=$(node -e "console.log(Buffer.from(JSON.stringify({name:'sum test', testCode:'expect(sum(1,2)).toBe(3)'})).toString('base64'))")

docker run --rm frontendlabs-executor:latest node executor.js $CODE_B64 $TIME_B64 $TEST_B64
```

PowerShell example (Windows):

```powershell
$code = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("function sum(a,b){return a+b;}"))
$time = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("5000"))
$test = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes((ConvertTo-Json @{ name = 'sum test'; testCode = "expect(sum(1,2)).toBe(3)" } -Compress)))

docker run --rm frontendlabs-executor:latest node executor.js $code $time $test
```

## Integration notes

- The container runs as a non-root `executor` user and uses `/tmp/execution` for temp files.
- Map `/tmp/execution` to a host path if you need to inspect artifacts.
- Ensure Docker daemon is available on the host where you deploy.

## Using the remote HTTP executor

- When you deploy the executor on Render (or any container host) it exposes an HTTP endpoint at `/execute`.
- Configure your backend to forward execution requests by setting environment variable `EXECUTOR_URL` to the executor's base URL (for example `https://frontendlabs-docker-executor.onrender.com`).
- An example `.env.example` with this value is included at `Backend/.env.example`.
- The backend will send a single test case per request in the shape: `{ code: string, testCase: object, timeout: number, problemType: string }`.


If you'd like, I can add a `docker-compose.yml` to orchestrate the executor alongside the backend server and provide a simple API test route to call the executor container. Would you like me to add that?