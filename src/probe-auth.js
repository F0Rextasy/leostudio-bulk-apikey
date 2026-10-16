#!/usr/bin/env node
'use strict';

/**
 * Which auth carrier does this fork's /api/user/self accept?
 *
 * Measured 2026-10-15: register+login answer 200/success, but every authed call
 * (self/checkin/token) answers `401 {"message":"Unauthorized, invalid access
 * token"}` with the session cookie + an empty `New-Api-User` header. This probe
 * logs in with an account record the mint already created and replays the same
 * request under every plausible carrier, so the fix is evidence-based.
 *
 *   node src/probe-auth.js
 */

const path = require('path');
const { loadExits, req, writeJson, nowIso } = require('./lib.js');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://api.leostudio.cc';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36';

const accounts = require(path.join(ROOT, 'accounts.json'));
const rec = accounts.filter((a) => a.steps && a.steps.login && a.steps.login.success).slice(-1)[0];
if (!rec) throw new Error('no registered account with a successful login on file');
console.log(`account #${rec.index} ${rec.username} (${rec.email})`);

const pool = loadExits([path.join(ROOT, 'out', 'pool', 'screened-api.leostudio.cc.txt')], { shuffle: false });
console.log(`exits: ${pool.length}`);

async function via(p, pathname, { method = 'GET', body = null, headers = {} } = {}) {
  const res = await req(p, BASE + pathname, {
    method,
    body,
    timeoutMs: 30000,
    connectTimeoutMs: 8000,
    headers: { accept: 'application/json, text/plain, */*', 'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8', 'user-agent': UA, ...headers },
  });
  let json = null;
  try {
    json = JSON.parse(res.text);
  } catch (e) {}
  return { status: res.status, json, text: String(res.text).slice(0, 300), setCookie: res.headers['set-cookie'] || null, exit: p.line };
}

(async () => {
  // 1) login and capture the full answer
  let login = null;
  let pin = null;
  for (const p of pool) {
    try {
      login = await via(p, '/api/user/login', { method: 'POST', body: { username: rec.username, password: rec.password } });
      pin = p;
      break;
    } catch (e) {
      console.log(`  exit died on login: ${p.line} (${String(e.message).slice(0, 60)})`);
    }
  }
  if (!login) throw new Error('no exit could login');
  console.log('login →', login.status, login.text.slice(0, 200));
  console.log('login json keys:', login.json ? Object.keys(login.json) : null, '| data keys:', login.json && login.json.data ? Object.keys(login.json.data) : null);
  console.log('set-cookie:', (login.setCookie || []).map((c) => c.split(';')[0]).join(' | ') || 'none');

  const cookie = (login.setCookie || []).map((c) => c.split(';')[0]).join('; ');
  const id = login.json && login.json.data && (login.json.data.id || login.json.data.user_id);
  const token = login.json && login.json.data && (login.json.data.access_token || login.json.data.token);

  const variants = [
    ['cookie only', { cookie }],
    ['cookie + new-api-user:' + id, { cookie, 'new-api-user': String(id || '') }],
    ['cookie + bearer', { cookie, ...(token ? { authorization: `Bearer ${token}` } : {}) }],
    ['bearer only', { ...(token ? { authorization: `Bearer ${token}` } : {}) }],
    ['cookie + new-api-user + bearer', { cookie, 'new-api-user': String(id || ''), ...(token ? { authorization: `Bearer ${token}` } : {}) }],
    ['new-api-user only', { 'new-api-user': String(id || '') }],
  ];
  const rows = [];
  for (const [name, headers] of variants) {
    let r = null;
    try {
      r = await via(pin, '/api/user/self', { headers });
    } catch (e) {
      r = { status: 0, error: String(e.message).slice(0, 120) };
    }
    rows.push({ name, ...r });
    console.log(`  self [${name}] → ${r.status} ${String(r.json ? JSON.stringify(r.json) : r.error || r.text).slice(0, 140)}`);
  }
  // also: which one works for checkin/token? (use the winning shape if any)
  const win = rows.find((r) => r.status === 200);
  if (win) {
    const shape = variants.find(([n]) => n === win.name)[1];
    const ci = await via(pin, '/api/user/checkin', { method: 'POST', body: {}, headers: shape });
    console.log(`  checkin [${win.name}] → ${ci.status} ${ci.text.slice(0, 120)}`);
    const tk = await via(pin, '/api/token/', {
      method: 'POST',
      body: { name: 'cnw4-probe', remain_quota: 0, expired_time: -1, unlimited_quota: false, model_limits_enabled: false, model_limits: '', allow_ips: '', group: '' },
      headers: shape,
    });
    console.log(`  token [${win.name}] → ${tk.status} ${tk.text.slice(0, 200)}`);
    rows.push({ name: 'checkin@' + win.name, ...ci });
    rows.push({ name: 'token@' + win.name, ...tk });
  }
  writeJson(path.join(ROOT, 'out', 'auth-probe.json'), { at: nowIso(), account: rec.username, login: { status: login.status, json: login.json, setCookie: login.setCookie }, variants: rows });
  console.log('→ out/auth-probe.json');
})().catch((e) => {
  console.error('probe failed:', e.message);
  process.exit(1);
});
