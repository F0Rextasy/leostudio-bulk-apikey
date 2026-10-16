#!/usr/bin/env node
'use strict';

/**
 * Command dispatcher for leostudio-bulk-apikey.
 *
 *   node cli.js mint     create fresh accounts and mint one key each
 *   node cli.js verify   re-check keys that are already on disk
 *   node cli.js probe    deep probe of a single account or key
 *   node cli.js help
 *
 * Every task spawns the matching module in this folder, so a crash in one run
 * never leaves state behind in this process.
 */

const path = require('path');
const { spawnSync } = require('child_process');
const { connectKeysFile, parseRouterArgs } = require('./connect-9router.js');

const TASKS = {
  mint: { file: 'mint.js', note: 'create fresh accounts and mint one key each' },
  verify: { file: 'probe-key.js', note: 're-check keys that are already on disk' },
  probe: { file: 'probe-key.js', note: 'deep probe of a single account or key' },
};

function help() {
  console.log('leostudio-bulk-apikey — One leostudio account per API key — captcha-free signup, live-verified, any number you want.\n');
  console.log('usage: node cli.js <task> [options]\n');
  console.log('tasks:');
  for (const [name, t] of Object.entries(TASKS)) console.log('  ' + name.padEnd(9) + ' ' + t.note);
  console.log('\noptions: every task takes its own flags — ask it directly:');
  console.log('  node <task-file> --help');
  console.log('  --connect-9router  register the keys in 9Router after the task finishes');
  console.log('\nproxy pool:');
  console.log('  one exit per line in proxies.txt — scheme://host:port[#comment], user:pass@ supported');
  console.log('\nno options? run the interactive launcher:  node launcher.js');
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
