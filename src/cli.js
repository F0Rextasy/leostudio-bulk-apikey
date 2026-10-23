#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for leostudio-bulk-apikey.
 *
 *   node src/cli.js mint     create fresh accounts and mint one key each
 *   node src/cli.js verify   re-check keys that are already on disk
 *   node src/cli.js probe    deep probe of a single account or key
 *   node src/cli.js help
 *
 * Every task spawns the matching module in this folder, so a crash in one run
 * never leaves state behind in this process.
 */

const path = require('path');
const { spawnSync } = require('child_process');
const { connectKeysFile, parseRouterArgs } = require('./connect-9router.js');

// The captcha entry point of this repo (see src/solver.js): this rail is HTTP,
// so --auto is the default and needs no token.
const { solverState } = require('./solver.js');

const TASKS = {
  mint: { file: 'mint.js', note: 'create fresh accounts and mint one key each' },
  verify: { file: 'probe-key.js', note: 're-check keys that are already on disk' },
  probe: { file: 'probe-key.js', note: 'deep probe of a single account or key' },
};

function help() {
  console.log('leostudio-bulk-apikey — Bulk-create Leo Studio accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.\n');
  console.log('usage: node src/cli.js <task> [options]\n');
  console.log('one command:');
  console.log('  node src/cli.js mint --count N        mint N accounts, one key each (auto, no token)\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node src/<task-file> --help');
  console.log('  --count N          accounts (= keys) to mint                          [50]');
  console.log('  --auto             captcha step automatic — DEFAULT, always on');
  console.log('  --connect-9router  register the keys in 9Router after the task finishes');
  console.log('  captcha: ' + solverState());
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node src/launcher.js');
}

const argv = process.argv.slice(2);
const task = argv[0];
if (!task || task === 'help' || task === '--help' || task === '-h') {
  help();
  process.exit(0);
}
const entry = TASKS[task];
if (!entry) {
  console.error('unknown task: ' + task + '\n');
  help();
  process.exit(1);
}
const rest = argv.slice(1);
const connect = rest.includes('--connect-9router');
const child = spawnSync(process.execPath, [path.join(__dirname, entry.file), ...rest], {
  windowsHide: true,
  stdio: 'inherit',
  env: process.env,
});
const status = child.status === null ? 1 : child.status;
if (!connect) process.exit(status);
connectKeysFile(parseRouterArgs(rest)).then(
  () => {
    process.exitCode = status;
  },
  (e) => {
    console.error('[9router] ' + (e && e.message ? e.message : e));
    process.exitCode = 1;
  }
);
