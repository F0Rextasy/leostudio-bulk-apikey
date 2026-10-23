#!/usr/bin/env node
'use strict';
// Re-runnable mint for this provider; gates + engine live in ./config.json.
// keys.txt holds only live-verified keys: a key that fails the live gate leaves
// keys.txt and is written to keys-dead.txt (see mint-newapi-pinned.js).
process.argv.push('--name', require('path').basename(require('path').resolve(__dirname, '..')));
require('./provider-cli.js');
