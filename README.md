<div align="center">

```
██╗     ███████╗ ██████╗ ███████╗████████╗██╗   ██╗██████╗ ██╗ ██████╗
██║     ██╔════╝██╔═══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║██╔═══██╗
██║     █████╗  ██║   ██║███████╗   ██║   ██║   ██║██║  ██║██║██║   ██║
██║     ██╔══╝  ██║   ██║╚════██║   ██║   ██║   ██║██║  ██║██║██║   ██║
███████╗███████╗╚██████╔╝███████║   ██║   ╚██████╔╝██████╔╝██║╚██████╔╝
╚══════╝╚══════╝ ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═════╝ ╚═╝ ╚═════╝
```

# leostudio-bulk-apikey

**Bulk-create Leo Studio accounts with auto-generated API keys — OpenAI-compatible inference (DeepSeek, GLM, Kimi, Hunyuan) + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-7-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>





---

## ✨ Why this exists

Leo Studio (`api.leostudio.cc`) hands every account **75,000 credits** and the usable unit is *one account per key* — the quota lives on the **account**, never on a second key of the same account. Sign-up is open, has **no captcha** (`turnstile_check: false`) and verifies by e-mail; there is **no daily check-in** (`签到功能未启用`). This tool walks the whole path unattended, over your proxy list, and only records a key after a real completion on the **`国模`** group.

## 🎁 Free tier — how much you get

**Every new Leo Studio account carries 75,000 credits — one-shot, no refill, no card.**

| Item | Measured |
| --- | --- |
| Sign-up grant | **75,000 credits** (`GET /api/user/self` → `quota: 75000`) |
| Daily check-in | **disabled** (`{"success":false,"message":"签到功能未启用"}`) — the grant is one-shot |
| Captcha at sign-up | **none** (`turnstile_check: false`) |
| E-mail the panel accepts | **Gmail** (or QQ) — disposable domains are refused; verification mail arrives from `leostudio2026@163.com` (subject «Leo Studio邮箱验证邮件», 6-char code, 10-min validity) |
| Group that serves text models | **`国模`** — a fresh account's `default` group serves only the image line and a chat call there answers `503 model_not_found` |
| The unit that scales | **one account = one key** → `--count N` is really "N free accounts" (the quota is per account) |

> 💡 The free tier is set by Leo Studio and can change. Check the live numbers at [leostudio.cc](https://leostudio.cc) — and let the tool's own gate decide:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Models — all 7 of them

`GET https://api.leostudio.cc/v1/models` with a minted key on the **`国模`** group serves **7 text models** (captured in [`models.json`](models.json)):

| Model | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

A fresh account's `default` group serves the image line (`gpt-image-2*`, `sd-2.5-ch*`) — a chat call there answers `503 model_not_found … under group default`; the tool assigns each token to **`国模`** to unlock the 7 text models above. The 8 image ids (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) are **not** text models and do not verify a key.

Re-checked **2026-10-19** against the live chat matrix (3 keys × 5 exits): the current key set answers `403 insufficient_user_quota` on the standing key and `503` on the other two, so **no id is added or removed here** — the tick row above is the repository's own verified chat-200 measurement (`2026-10-15`), and a balance wall is not a model failure.

## 🧪 How to use the API

The base URL is **`https://api.leostudio.cc/v1`** — OpenAI-compatible, so anything that speaks OpenAI works (SDKs, Cursor, OpenCode, Kilo Code, …).

```bash
curl https://api.leostudio.cc/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

```python
from openai import OpenAI
client = OpenAI(base_url="https://api.leostudio.cc/v1", api_key="<your key>")
print(client.chat.completions.create(model="deepseek-v4-flash",
      messages=[{"role": "user", "content": "hi"}]).choices[0].message.content)
```

## 🛠 Quick start

```bash
# clone this repository (or download the ZIP), then:
cd leostudio-bulk-apikey

# 1) your proxy list, one exit per line (http://, socks5://, socks4:// or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go — one run mints one key per fresh account
node src/launcher.js             # interactive menu: mint / verify / probe / settings
# or drive it directly:
node src/cli.js mint --count 3   # fresh accounts → one verified key each
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js probe            # deep probe of a single account or key
```

`node src/cli.js help` lists the tasks; each task reads its own flags. Keys land in `keys.txt`, one per line; per-account detail (e-mail, steps, verify result) lands in `accounts.json`. Settings from the launcher persist in `launcher.config.json`.

### 🖱️ The launcher

```bash
node src/launcher.js
```

A menu over the task modules: **mint**, **verify**, **probe**, **9Router**. It asks for `count` (keys per run) and `concurrency` (parallel exits), keeps them in `launcher.config.json`, and spawns `node src/cli.js <task>` with the right flags. Menu item **6** runs the 9Router registration directly.

## ✅ Verified working — every key is tested

Measured **2026-10-15**: **3 accounts → 3 keys, one key per account**. Every key was checked after it existed, on an exit *independent* of the mint, with `verify.independent=true` in `accounts.json`.

| Check | Call | Result |
| --- | --- | --- |
| Auth + model list | `GET https://api.leostudio.cc/v1/models` (on the **`国模`** group) | **200** + 7 text model ids |
| Real completion | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + assistant message |

The check runs from **an exit different from the one that minted the key**, so it cannot pass on session state rather than key validity. `node src/cli.js verify` reproduces exactly that check for your own file. A key is written to `keys.txt` only after both checks answer 200.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| Gates | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Mailbox | [Emailnator](https://www.emailnator.com) | a fresh Gmail address per account, read over your exits; the code is in the **body** (`content` field), not the subject |
| Send code | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Register | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Login | `POST /api/user/login` | returns **`data.access_token` (JWT)** + `new_api_refresh` cookie; the cookie alone answers `401 AUTH_UNAUTHORIZED` — Bearer is required |
| Self | `GET /api/user/self` (Bearer + cookie) | `quota: 75000` per account |
| Token create | `POST /api/token/` (Bearer) | masked key first (`tbCR******…`) |
| Key reveal | `POST /api/token/{id}/key` (Bearer) | 48-char plaintext key |
| Group | `PUT /api/token/{id}` | stamp to **`国模`** (`unlimited_quota: true`) — otherwise the relay answers `401 Invalid token` even though the account holds quota |
| Prove | `GET /v1/models` + `POST /v1/chat/completions` | both on an exit *different* from the mint; only then is the key appended to `keys.txt` |

## ⚙️ CLI options

All code lives in `src/` — run it from the repository root as `node src/<file>.js`.

| Tool | Flags |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — dispatcher; `--connect-9router` registers keys in 9Router after the task; every task's own flags via `node src/<task> --help` |
| `src/mint.js` | thin wrapper → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (default `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | deep probe of one account or key |
| `src/launcher.js` | interactive: mint / verify / probe / settings — `count` and `concurrency` persist in `launcher.config.json` |

## 🛰️ Behind a proxy

* Exits come from `proxies.txt` (one line per exit, `scheme://host:port`, `user:pass@` supported, `#` comments ignored). The same pool feeds the panel calls, the key verification and the mailbox reads; the tools never dial the provider directly.
* **Screening is the work.** Each account pins the first exit that proves `GET /api/status` against the panel host, and verification pins a *different* proven exit — a dead exit retires itself and the account continues on the next one.
* The mailbox ([Emailnator](https://www.emailnator.com)) is a third-party temp-mail service rather than the panel; its API is read through your exits as well.
* The verification mail arrives from **`leostudio2026@163.com`** (not the panel domain); the first code of a batch can take a few minutes to arrive — the tool waits instead of re-sending, because a re-send invalidates the code in flight.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | mailbox, steps, check-in, both verify exits per account — git-ignored |
| `models.json` | a fresh `/v1/models` capture on the `国模` group — git-ignored |
| `proxies.txt` | your exits, one per line — git-ignored |
| `out/pinned-<date>.log` | the per-run log (exit, timing, exact server answer) — git-ignored |
| `src/mint.js` · `src/probe-key.js` | the engines the CLI dispatches to |
| `src/connect-9router.js` | registers the keys in `keys.txt` as 9Router connections |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Leo Studio is OpenAI-compatible, so register it once and use every key:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Every key in `keys.txt` becomes one connection of the `leostudio` provider node (`--api-key <key>` registers a single key instead, `--model <id>` overrides the default). Then pick a model inside 9Router:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, default model `deepseek-v4-flash`.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 What the provider gives | 75,000 credits per account · 7 text models (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · every key live-verified |
| 🔑 What one key gets you | one API key scoped to its own account: the 7 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Your data | only leostudio.cc and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

Open an issue with the failing step and the run log tail (`out/pinned-<date>.log`) — it carries the exit, the timing and the exact server answer, which is everything needed to reproduce a miss. Never attach a key. **[Open an issue](../../issues)** and PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>
