<div align="center">

```
███████╗ ██████╗ ██████╗ ███████╗██╗  ██╗████████╗ █████╗ ███████╗██╗   ██╗
██╔════╝██╔═████╗██╔══██╗██╔════╝╚██╗██╔╝╚══██╔══╝██╔══██╗██╔════╝╚██╗ ██╔╝
█████╗  ██║██╔██║██████╔╝█████╗   ╚███╔╝    ██║   ███████║███████╗ ╚████╔╝
██╔══╝  ██║████╔╝██╔══██╗██╔══╝   ██╔██╗    ██║   ██╔══██║╚════██║  ╚██╔╝
██║     ╚██████╔╝██║  ██║███████╗██╔╝ ██╗   ██║   ██║  ██║███████║   ██║
╚═╝      ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝   ╚═╝
```

# leostudio-bulk-apikey

**Bulk-create [Leo Studio](https://leostudio.cc) accounts with auto-generated API keys — OpenAI-compatible inference + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20text-412991?style=for-the-badge)](models.json)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)

[🛠 Quick start](#-quick-start) · [✅ Verified](#-verified-working--every-key-is-tested) · [📬 Mail](#-mail) · [🧭 How it works](#-how-it-works) · [🤖 Models & free tier](#-models--free-tier) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🔌 9Router](#-connect-to-9router) · [🐞 Issues](#-issues)

</div>

---

> **One account, one key.** N accounts → N keys, one sign-up each, every key verified live
> before it lands in `keys.txt`.

## ✨ Why this exists

Leo Studio (`api.leostudio.cc`) hands every account a free quota — and the usable unit is *one
account per key*, because the quota lives on the **account**, never on a second key of the same
account. Sign-up is open, has **no captcha** (`turnstile_check: false` on the panel's own status
route) and verifies by e-mail; there is **no daily check-in** to top the quota up. This tool walks
the whole path unattended, over your proxy list, and only records a key after a real completion:

```
proxies.txt ──▶ exit screened against api.leostudio.cc (each fresh exit is proven before it is spent)
                    │
                    ▼
   fresh verification address ──▶ GET /api/verification ──▶ code mail (read from the body)
        │                                                          │
        ▼                                                          ▼
   POST /api/user/register ──▶ login (JWT) ──▶ POST /api/token/
                                                   └─▶ reveal ─▶ group `国模`
                                                                     │
        keys.txt  ◀── live verify: GET /v1/models 200 + POST /v1/chat/completions 200 ──┘
```

## 🤖 Models & free tier

`models.json` is the live `GET /v1/models` answer of a minted key on the `国模` group — **7 text
models**:

| id | note |
|---|---|
| `deepseek-v4-flash` | the verifier's default chat model |
| `deepseek-v4.1-flash` | the next DeepSeek flash |
| `glm-5.2`, `glm-5.3-flash` | GLM line |
| `kimi-k3` | Moonshot |
| `hy3`, `hy4-preview` | Hunyuan line |

**How much is free:** each account carries **75,000 credits** — `GET /api/user/self` reports
`quota: 75000` per account, and the panel runs **no daily check-in** (`{"success":false,"message":
"签到功能未启用"}`), so the grant is one-shot: it is spent, never refilled. New account = new 75,000
credits, which is why the tool mints **one key per account** and `--count N` is your quota
multiplier.

**Groups decide what a key can call.** A fresh account's `default` group serves the panel's image
line (`gpt-image-2*`, `sd-2.5-ch*`) and a chat call there answers
`503 model_not_found … under group default`; the tool assigns the token to the **`国模`** group,
which is what unlocks the 7 text models above. If you import one of these keys into another client
and see `model_not_found`, it is the group, not the key.

```bash
curl https://api.leostudio.cc/v1/chat/completions \
  -H "Authorization: Bearer <one of your keys>" \
  -H "Content-Type: application/json" \
  -d '{"model":"deepseek-v4-flash","messages":[{"role":"user","content":"hi"}]}'
```

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd leostudio-bulk-apikey

# 1) your proxy list — one exit per line (http://, socks5://, socks4://, or bare host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go — one run mints one key per fresh account
node launcher.js                 # interactive menu: mint / verify / probe / settings
# or drive it directly:
node cli.js mint --count 3       # fresh accounts → one verified key each
node cli.js verify               # re-check the keys already on disk
node cli.js probe                # deep probe of a single account or key
```

`node cli.js help` lists the tasks; every task takes its own flags — ask it directly
(`node mint.js --help`). Keys land in `keys.txt`, one per line; per-account detail (e-mail,
steps, verify result) lands in `accounts.json`. Settings from the launcher persist in
`launcher.config.json`.

## ✅ Verified working — every key is tested

A key is written to `keys.txt` only after the live API answers with it:

| check | call | expected |
|---|---|---|
| auth + model list | `GET https://api.leostudio.cc/v1/models` | `200` + the account's model ids (7 on the `国模` group) |
| real completion | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | `200` + the assistant message |

The check runs from **an exit different from the one that minted the key**, so it cannot pass on
session state rather than key validity. `node cli.js verify` reproduces exactly that check for your
own file.

## 📬 Mail

The panel's verification route (`GET /api/verification?email=…`) answers on the **address class**
before anything is sent, and the class that works for an unattended tool is narrow: **a real Gmail
address** (or a QQ address) is accepted; disposable domains are refused by policy. The tool
registers and reads a real mailbox for you.

Two facts worth knowing up front: the verification mail **does not come from the panel's domain** —
it arrives from a third-party sender (subject «Leo Studio邮箱验证邮件»,
six-character code, 10-minute validity) — and the **first code of a batch can take a few minutes**
to arrive. The tool waits out that window instead of re-sending, because a re-send invalidates the
code already in flight.

## 🧭 How it works

Per account, end to end over one exit:

1. a fresh exit from `proxies.txt`, proven against the panel right then (a dead exit costs one
   attempt, not the batch);
2. a fresh verification address — these panels only accept a real Gmail (or QQ) mailbox, so the
   tool registers one and reads the code from the message **body**;
3. `GET /api/verification?email=…` → the code mail («Leo Studio邮箱验证邮件», 10-minute
   validity, six-character code) → `POST /api/user/register`;
4. `POST /api/user/login` — this fork answers with a **JWT**; the tool carries it as a Bearer
   token (the session cookie alone is answered `401 AUTH_UNAUTHORIZED`);
5. `POST /api/token/` → the plaintext key comes from the reveal route
   (`POST /api/token/{id}/key`), and the token is created **unlimited** so the relay accepts it
   from the account's quota;
6. the token's group is set to **`国模`** — a fresh account's default group serves the image line
   only;
7. the key is captured, then verified live (`/v1/models` + a chat completion) and appended to
   `keys.txt` + `accounts.json`.

## ⚙️ CLI options

| task | flags |
|---|---|
| `mint` | `--count N` (30) · `--conc N` (2) — plus the engine's own flags (`node mint.js --help`) |
| `verify` | re-checks the keys already on disk (`probe-key.js`) |
| `probe` | deep probe of a single account or key (`probe-key.js`) |
| `launcher.js` | interactive: mint / verify / probe / settings — persisted in `launcher.config.json` |
| `--connect-9router` | on any task: after it finishes, registers every key in `keys.txt` into a running 9Router (`node connect-9router.js --help`) |

## 🛰️ Behind a proxy

* `proxies.txt` — one exit per line; `scheme://user:pass@host:port`, `scheme://host:port` or bare
  `host:port` (defaults to `http://`). Comments after `#` and blank lines are ignored.
* Exits are proven against the panel **at the moment of use**; dead ones are retired and the pool
  is only re-read when the usable set runs dry.
* Every panel request — and the mailbox traffic — goes through the pool; nothing leaves your own
  interface. Use exits you are allowed to use.

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Leo Studio serves an
OpenAI-compatible endpoint (`https://api.leostudio.cc/v1`), so register it once and every key you
minted becomes a connection under one provider-node — 9Router load-balances across them:

```bash
node connect-9router.js \
  --base http://localhost:20128 --password 123456 \
  --api-key sk-xxxxxxxx
```

Run it without `--api-key` to register **every** key in `keys.txt`. Re-running is idempotent: the
node is matched by `--prefix leostudio`, each connection is matched by name (`leostudio-001`,
`leostudio-002`, …), and an already-registered key is left alone. Defaults:
`--base http://localhost:20128`, `--password 123456`, `--name "Leo Studio"`,
`--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, `--model deepseek-v4-flash`.

Inside 9Router the keys are served as:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

`node cli.js mint --count 3 --connect-9router` mints and registers in one pass, and
`node launcher.js` drives the same flow from its menu.

## 🐞 Issues

Open an issue with the failing step, the exit used and the tool's stdout — the per-account dumps in
`accounts.json` and `outputs/` make failures reproducible without leaking a key.

## 📄 License

MIT — see [LICENSE](LICENSE). Use it on accounts you are allowed to create.

---

<div align="center">

**[MIT](LICENSE) © 2026 leostudio-bulk-apikey contributors**

</div>
