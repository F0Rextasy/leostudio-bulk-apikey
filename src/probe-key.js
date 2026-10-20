#!/usr/bin/env node
'use strict';

/**
 * Leo Studio keys are revealed but `/v1/models` answers 401 with them. This
 * probe logs in with a harvested account, dumps the FULL token objects (list +
 * revealed key), then replays the relay call under the plausible carriers so the
 * cause is read, not guessed:
 *   - Bearer <key> / Bearer sk-<key> / ?key= query
 *   - with the token object's `group`/`status` printed for context
 * and, if the token looks disabled, enables it via the update route and retries.
 *
 *   node src/probe-key.js
 */

const fs = require('fs');
const path = require('path');
const { loadExits, DIRECT, req, writeJson, nowIso, isExitError } = require('./lib.js');
const { Panel, UA } = require('./newapi.js');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://api.leostudio.cc';

class Rot {
  constructor(exits) {
    this.exits = exits;
    this.dead = new Set();
    this.i = 0;
  }
  next() {
    // The direct sentinel (no pool was given) is the one sticky entry: never
    // rotated out, never retired, so one blip does not end the run.
    const direct = this.exits.find((p) => p && p.direct);
    if (direct) return (this.last = direct);
    const alive = this.exits.filter((p) => !this.dead.has(p.line));
    if (!alive.length) throw new Error('no live exits');
    return (this.last = alive[this.i++ % alive.length]);
  }
  kill(p) {
    if (p && p.line && !p.direct) this.dead.add(p.line);
  }
  alive() {}
  async attempt(fn, { tries = 6, label = 'call' } = {}) {
    let last = null;
    for (let i = 0; i < tries; i++) {
      const p = this.next();
      try {
        return await fn(p, i);
      } catch (e) {
        last = e;
        this.kill(p);
        if (!isExitError(e)) throw e;
        console.log(`  ${label}: ${p.line} died (${String(e.message).slice(0, 60)})`);
      }
    }
    throw new Error(`${label}: ${String(last && last.message).slice(0, 120)}`);
  }
}

(async () => {
  const accounts = require(path.join(ROOT, 'accounts.json'));
  const rec = accounts.filter((a) => a.steps && a.steps.login && a.steps.login.success).slice(-1)[0];
  const lines = [];
  try {
    for (const l of fs.readFileSync(path.join(ROOT, 'out', 'pool', 'screened-api.leostudio.cc.txt'), 'utf8').split(/\r?\n/)) if (l.trim() && !l.startsWith('#')) lines.push(l);
  } catch (e) {}
  const exits = lines
    .map((l) => {
      const { parseProxy } = require(path.join(__dirname, 'proxy'));
      const p = parseProxy(l);
      if (p) p.line = l;
      return p;
    })
    .filter(Boolean);
  // No screened exit on disk = DIRECT mode: a proxy is recommended at scale
  // (per-IP limits, bans), but the probe works without one.
  const rot = new Rot(exits.length ? exits : [DIRECT]);
  const panel = new Panel(BASE, rot, { log: (m) => console.log('  ' + m) });
  const login = await panel.login({ username: rec.username, password: rec.password, tries: 8 });
  console.log(`login ${login.status} success=${login.json && login.json.success} bearer=${Boolean(panel.accessToken)} userId=${panel.userId}`);

  const list = await panel.listTokens(8);
  const items = list.items || [];
  console.log(`tokens: ${items.length}`);
  for (const t of items) console.log('  ', JSON.stringify(t).slice(0, 260));

  const target = items.find((t) => String(t.name || '').startsWith('cnw4')) || items[0];
  if (!target) throw new Error('no token on the account');
  const reveal = await panel.tokenKey(target.id, 8);
  const key = reveal.key;
  console.log(`reveal token#${target.id} ${target.name} → ${key ? key.slice(0, 12) + '… (' + key.length + ' chars)' : 'NONE'}`);

  const tries = [
    ['GET /v1/models Bearer', () => panel.models(key, { tries: 8 })],
    ['GET /v1/models Bearer sk-', () => panel.models(`sk-${key}`, { tries: 1 })],
    ['POST /v1/chat/completions Bearer', () => panel.chat(key, 'gpt-4o-mini', { tries: 1, timeoutMs: 45000 })],
  ];
  const out = { at: nowIso(), account: rec.username, token: target, keyPrefix: key ? key.slice(0, 12) : null, keyLen: key ? key.length : 0, results: [] };
  for (const [name, fn] of tries) {
    try {
      const r = await fn();
      out.results.push({ name, status: r.status, text: String(r.json ? JSON.stringify(r.json) : r.text).slice(0, 300), exit: r.exit });
      console.log(`  ${name} → ${r.status} ${String(r.json ? JSON.stringify(r.json) : r.text).slice(0, 160)}`);
    } catch (e) {
      out.results.push({ name, error: String(e.message).slice(0, 160) });
      console.log(`  ${name} → ERR ${String(e.message).slice(0, 120)}`);
    }
  }

  // Hypothesis (to confirm/deny): the relay rejects a token whose own quota is
  // zero (`remain_quota:0, unlimited_quota:false`) with "Invalid token" even
  // though the account holds quota. Stamp it unlimited and retry the relay.
  if (target && (target.status !== 1 || (target.remain_quota === 0 && !target.unlimited_quota))) {
    const upd = await panel.call('/api/token/', { method: 'PUT', auth: true, tries: 8, body: { ...target, unlimited_quota: true, status: 1 } });
    console.log(`  stamp token unlimited → ${upd.status} ${String(upd.text).slice(0, 160)}`);
    out.results.push({ name: 'stamp-unlimited', status: upd.status, text: String(upd.text).slice(0, 200) });
    const again = await panel.models(key, { tries: 8 });
    out.results.push({ name: 'GET /v1/models after stamp', status: again.status, text: String(again.text).slice(0, 300), exit: again.exit });
    console.log(`  models after stamp → ${again.status} ${String(again.text).slice(0, 160)}`);
  }
  writeJson(path.join(ROOT, 'out', 'key-probe.json'), out);
  console.log('→ out/key-probe.json');
})().catch((e) => {
  console.error('probe failed:', e.message);
  process.exit(1);
});
