#!/usr/bin/env node
'use strict';

/**
 * One-account group test for Leo Studio: does the token group override unlock
 * the panel's text groups (`国模`, `按次集合`, …)? The panel's own pricing shows
 * the image models under `default` (what our keys already serve, 200) and the
 * text models under other groups. Tested on ONE account with restore: if the
 * PUT is refused or the relay rejects the stamped group, the token group goes
 * back to `` and the key is re-verified so nothing is left worse.
 *
 *   node src/probe-group.js [--group 国模]
 */

const fs = require('fs');
const path = require('path');
const { req, DIRECT, writeJson, nowIso, isExitError } = require('./lib.js');
const { collectCandidates, screenFor } = require('./xwave-lib.js');
const { Panel, UA } = require('./newapi.js');

const BASE = 'https://api.leostudio.cc';
const ROOT = path.resolve(__dirname, '..');
const GROUP = (() => {
  const i = process.argv.indexOf('--group');
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : '国模';
})();

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
  async attempt(fn, { tries = 8, label = 'call' } = {}) {
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
  const rec = require(path.join(ROOT, 'accounts.json')).filter((a) => a.status === 'minted')[0];
  const { candidates } = await collectCandidates({ host: 'api.leostudio.cc', log: (m) => console.log('· ' + m) });
  const { exits } = await screenFor(BASE, candidates, { want: 6, conc: 3, budgetMs: 150000, log: (m) => console.log('· ' + m) });
  // No exit answered the screen = DIRECT mode: a proxy is recommended at scale
  // (per-IP limits, bans), but the probe works without one.
  const rot = new Rot(exits.length ? exits : [DIRECT]);
  const panel = new Panel(BASE, rot, { log: (m) => console.log('  ' + m) });
  const login = await panel.login({ username: rec.username, password: rec.password, tries: 8 });
  console.log(`login ${login.status} success=${login.json && login.json.success}`);
  const list = await panel.listTokens(8);
  const mine = (list.items || [])[0];
  if (!mine) throw new Error('no token');
  const out = { at: nowIso(), group: GROUP, account: rec.username, token: mine.id, calls: [] };
  const put = async (group) => {
    const body = { id: mine.id, name: mine.name, remain_quota: 0, expired_time: -1, unlimited_quota: true, model_limits_enabled: false, model_limits: '', allow_ips: '', group, status: 1 };
    const r = await rot.attempt(async (p) => {
      const res = await req(p, BASE + '/api/token/', {
        method: 'PUT',
        body,
        headers: { accept: 'application/json', 'content-type': 'application/json', 'user-agent': UA, cookie: panel.cookie, ...(panel.accessToken ? { authorization: `Bearer ${panel.accessToken}` } : {}) },
        timeoutMs: 30000,
      });
      return { status: res.status, text: res.text.slice(0, 260) };
    });
    console.log(`PUT group='${group}' → ${r.status} ${r.text.slice(0, 160)}`);
    out.calls.push({ name: `PUT '${group}'`, ...r });
    return r;
  };
  const verify = async (label) => {
    const models = await panel.models(rec.key, { tries: 8 });
    const ids = models.status === 200 && models.json && Array.isArray(models.json.data) ? models.json.data.map((m) => m.id) : [];
    console.log(`[${label}] models → ${models.status} n=${ids.length} ${ids.slice(0, 6).join(', ')}`);
    out.calls.push({ name: `models@${label}`, status: models.status, n: ids.length, sample: ids.slice(0, 12) });
    let chat = null;
    const pick = ids.find((id) => /flash|lite|mini|free/i.test(id) && !/image|sd-|tts/i.test(id)) || ids.find((id) => /gpt/i.test(id)) || ids[0];
    if (pick) {
      const c = await panel.chat(rec.key, pick, { tries: 8, timeoutMs: 90000 });
      chat = { model: pick, status: c.status, text: (c.json ? JSON.stringify(c.json) : String(c.text)).slice(0, 300) };
      console.log(`[${label}] chat ${pick} → ${c.status} ${chat.text.slice(0, 160)}`);
      out.calls.push({ name: `chat ${pick}@${label}`, status: c.status, text: chat.text.slice(0, 260) });
    }
    return { ids, chat };
  };

  await put(GROUP);
  const stamped = await verify(`group=${GROUP}`);
  const textOk = stamped.chat && stamped.chat.status === 200;
  if (!textOk || stamped.ids.length === 0) {
    // restore: never leave a key worse than the 200/8-image baseline
    console.log('  not a win — restoring group "" and re-verifying');
    await put('');
    await verify('group=restored');
    out.restored = true;
  } else {
    out.win = true;
  }
  writeJson(path.join(ROOT, 'out', 'group-probe.json'), out);
  console.log('→ out/group-probe.json');
  process.exit(out.win ? 0 : 3);
})().catch((e) => {
  console.error('group probe failed:', e.message);
  process.exit(1);
});
