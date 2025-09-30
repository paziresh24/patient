#!/usr/bin/env node

// Custom wrapper around `next start` that ignores backgrounding tokens added by
// CI runners (like `& pid=$!`) so the app boots correctly during health checks.
const { spawn } = require('child_process');

const nextBin = require.resolve('next/dist/bin/next');

(async () => {
  try {
    const rawArgs = process.argv.slice(2);

    // Stop processing once shell control tokens appear. They are not real CLI
    // arguments for Next.js and would otherwise be interpreted as a directory
    // path, producing errors such as "/app/&".
    const cleanArgs = [];
    for (const arg of rawArgs) {
      if (arg === '&' || arg === '&&') {
        break;
      }

      // Skip empty strings in case the invoker collapses multiple spaces.
      if (arg.trim() === '') {
        continue;
      }

      cleanArgs.push(arg);
    }

    const child = spawn(process.execPath, [nextBin, 'start', ...cleanArgs], {
      stdio: 'inherit',
    });

    child.on('exit', code => {
      process.exit(code ?? 0);
    });

    child.on('error', err => {
      console.error('Failed to start Next.js:', err);
      process.exit(1);
    });

    process.on('SIGINT', () => {
      if (!child.killed) {
        child.kill('SIGINT');
      }
    });

    process.on('SIGTERM', () => {
      if (!child.killed) {
        child.kill('SIGTERM');
      }
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
