#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const path = require('node:path');

const packageRoot = path.resolve(__dirname, '..');
const cliEntrypoint = path.join(packageRoot, 'scripts', 'dg.ts');

const result = spawnSync(process.execPath, ['--import', 'tsx', cliEntrypoint, ...process.argv.slice(2)], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env,
});

if (result.error) {
  console.error(`Failed to launch dg: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 0);
