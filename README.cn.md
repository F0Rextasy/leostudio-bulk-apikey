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

**批量创建 Leo Studio 账号并自动生成 API 密钥 —— 兼容 OpenAI 的推理服务（DeepSeek、GLM、Kimi、Hunyuan）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-7-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么有这个项目

每个 Leo Studio（`api.leostudio.cc`）账号都会获得 **75,000 点额度**，而可用的单位是*一个账号一把密钥*——额度属于**账号**，同一账号的第二把密钥永远不会分摊额度。注册开放，**没有验证码**（`turnstile_check: false`），通过电子邮件验证；**没有每日签到**（`签到功能未启用`）。本工具通过你的代理列表无人值守地走完整个流程，只有在 **`国模`** 分组上完成一次真实调用后才会记录密钥。

## 🎁 免费额度 —— 你能拿到多少

**每个新的 Leo Studio 账号都带有 75,000 点额度——一次性发放，不补充，无需绑卡。**

| 项目 | 实测 |
| --- | --- |
| 注册赠送 | **75,000 点额度**（`GET /api/user/self` → `quota: 75000`） |
| 每日签到 | **已禁用**（`{"success":false,"message":"签到功能未启用"}`）——赠送是一次性的 |
| 注册验证码 | **无**（`turnstile_check: false`） |
| 面板接受的邮箱 | **Gmail**（或 QQ）——一次性域名会被拒绝；验证邮件来自 `leostudio2026@163.com`（主题为「Leo Studio邮箱验证邮件」，6 位验证码，10 分钟内有效） |
| 提供文本模型的分组 | **`国模`** ——新账号的 `default` 分组只提供图像线路，在那里发起对话请求会返回 `503 model_not_found` |
| 可扩展的单位 | **一个账号 = 一把密钥** → `--count N` 实际上是“N 个免费账号”（额度按账号计算） |

> 💡 免费额度由 Leo Studio 设定，可能发生变化。请在 [leostudio.cc](https://leostudio.cc) 查看实时数字——并让工具自身的校验来决定：

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 模型 —— 全部 7 个

使用在 **`国模`** 分组上铸造的密钥请求 `GET https://api.leostudio.cc/v1/models`，会返回 **7 个文本模型**（已记录在 [`models.json`](models.json) 中）：

| 模型 | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

新账号的 `default` 分组提供图像线路（`gpt-image-2*`、`sd-2.5-ch*`）——在那里发起对话请求会返回 `503 model_not_found … under group default`；本工具会把每个 token 分配到 **`国模`**，以解锁上面 7 个文本模型。这 8 个图像 id（`gpt-image-2`、`gpt-image-2.5*`、`sd-2.0-ch1`、`sd-2.5-ch*`）**不是**文本模型，无法用于验证密钥。

于 **2026-10-19** 对照实时对话矩阵（3 把密钥 × 5 个出口）重新检查：当前密钥集在常驻密钥上返回 `403 insufficient_user_quota`，另外两把返回 `503`，因此**此处不新增或删除任何 id**——上方的打勾行是仓库自身已验证的 chat-200 实测结果（`2026-10-15`），而余额限制并不是模型故障。

## 🧪 如何使用 API

基础 URL 为 **`https://api.leostudio.cc/v1`**——兼容 OpenAI，因此任何支持 OpenAI 协议的工具都能使用（SDK、Cursor、OpenCode、Kilo Code 等）。

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

## 🛠 快速开始

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

`node src/cli.js help` 会列出所有任务；每个任务读取自己的参数。密钥写入 `keys.txt`，每行一个；每个账号的详细信息（邮箱、步骤、验证结果）写入 `accounts.json`。启动器中的设置保存在 `launcher.config.json`。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖各任务模块的菜单：**mint**、**verify**、**probe**、**9Router**。它会询问 `count`（每次运行的密钥数）和 `concurrency`（并行出口数），保存在 `launcher.config.json` 中，并以正确的参数启动 `node src/cli.js <task>`。菜单项 **6** 直接运行 9Router 注册。

## ✅ 已验证可用 —— 每把密钥都经过测试

实测于 **2026-10-15**：**3 个账号 → 3 把密钥，一个账号一把密钥**。每把密钥在生成之后、在*独立于*铸造过程的出口上完成检查，`accounts.json` 中记录 `verify.independent=true`。

| 检查 | 调用 | 结果 |
| --- | --- | --- |
| 鉴权 + 模型列表 | `GET https://api.leostudio.cc/v1/models`（在 **`国模`** 分组上） | **200** + 7 个文本模型 id |
| 真实补全 | `POST https://api.leostudio.cc/v1/chat/completions`（`deepseek-v4-flash`） | **200** + 助手消息 |

检查从**与铸造密钥不同的出口**发起，因此它不可能仅凭会话状态而非密钥有效性通过。`node src/cli.js verify` 会对你的文件复现完全相同的检查。只有两项检查都返回 200 后，密钥才会写入 `keys.txt`。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 说明 |
| --- | --- | --- |
| 门槛 | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| 邮箱 | [Emailnator](https://www.emailnator.com) | 每个账号一个全新的 Gmail 地址，通过你的出口读取；验证码在**正文**（`content` 字段）中，而非主题 |
| 发送验证码 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 注册 | `POST /api/user/register`（`username`、`password`、`email`、`verification_code`） | `{"success":true}` |
| 登录 | `POST /api/user/login` | 返回 **`data.access_token`（JWT）** + `new_api_refresh` cookie；仅凭 cookie 会返回 `401 AUTH_UNAUTHORIZED`——必须使用 Bearer |
| 自身信息 | `GET /api/user/self`（Bearer + cookie） | 每个账号 `quota: 75000` |
| 创建 token | `POST /api/token/`（Bearer） | 先返回掩码密钥（`tbCR******…`） |
| 密钥揭示 | `POST /api/token/{id}/key`（Bearer） | 48 字符的明文密钥 |
| 分组 | `PUT /api/token/{id}` | 标记为 **`国模`**（`unlimited_quota: true`）——否则即使账号有额度，中继也会返回 `401 Invalid token` |
| 证明 | `GET /v1/models` + `POST /v1/chat/completions` | 两者都在*不同于*铸造的出口上执行；只有通过后才把密钥追加到 `keys.txt` |

## ⚙️ CLI 选项

所有代码都在 `src/` 中——在仓库根目录以 `node src/<file>.js` 运行。

| 工具 | 参数 |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` ——调度器；`--connect-9router` 在任务结束后把密钥注册到 9Router；各任务自身的参数见 `node src/<task> --help` |
| `src/mint.js` | 轻量封装 → `provider-cli.js` / `mint-newapi-pinned.js` —— `--count N`（3）· `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX`（默认 `leostudio2026@163`）· `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 对单个账号或密钥进行深度探测 |
| `src/launcher.js` | 交互式：mint / verify / probe / 设置 —— `count` 和 `concurrency` 保存在 `launcher.config.json` |

## 🛰️ 在代理之后

* 出口来自 `proxies.txt`（每行一个出口，格式为 `scheme://host:port`，支持 `user:pass@`，忽略 `#` 注释）。同一出口池同时用于面板调用、密钥验证和邮箱读取；工具从不直接连接服务商。
* **筛选就是工作本身。** 每个账号会固定第一个能对面板主机成功执行 `GET /api/status` 的出口，验证则固定一个*不同的*已验证出口——失效的出口会自动淘汰，账号在下一个出口上继续。
* 邮箱（[Emailnator](https://www.emailnator.com)）是第三方临时邮件服务，而非面板本身；其 API 同样通过你的出口访问。
* 验证邮件来自 **`leostudio2026@163.com`**（不是面板域名）；一批中的第一封验证码可能需要几分钟才能到达——工具会等待而不是重发，因为重发会使正在途中的验证码失效。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一把经过实时验证的密钥——已被 git 忽略 |
| `accounts.json` | 每个账号的邮箱、步骤、签到、两个验证出口——已被 git 忽略 |
| `models.json` | 在 `国模` 分组上新抓取的 `/v1/models` 结果——已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个——已被 git 忽略 |
| `out/pinned-<date>.log` | 每次运行的日志（出口、时间、服务器原始响应）——已被 git 忽略 |
| `src/mint.js` · `src/probe-key.js` | CLI 调度到的引擎 |
| `src/connect-9router.js` | 把 `keys.txt` 中的密钥注册为 9Router 连接 |

## 🔌 连接 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。Leo Studio 兼容 OpenAI，因此只需注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` 中的每把密钥都会成为 `leostudio` 提供者节点的一个连接（`--api-key <key>` 则只注册单把密钥，`--model <id>` 覆盖默认模型）。然后在 9Router 中选择模型：

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix leostudio`、`--base-url https://api.leostudio.cc/v1`，默认模型 `deepseek-v4-flash`。

## 🔑 一把密钥能给你什么

| | |
| --- | --- |
| 🏢 服务商 | **Leo Studio** —— [leostudio.cc](https://leostudio.cc) |
| 🎁 服务商提供什么 | 每个账号 75,000 点额度 · 7 个文本模型（deepseek-v4-flash、kimi-k3、glm-5.3-flash）· 每把密钥都经过实时验证 |
| 🔑 一把密钥能给你什么 | 一把作用于其所属账号的 API 密钥：下方端点上的 7 个模型 id，按你的套餐限制使用。额度属于**账号**，这正是本工具为每把密钥创建一个账号的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 你的数据 | 只会联系 leostudio.cc 和你配置的邮箱后端；密钥始终留在你的机器上 |

## 🐞 问题反馈

提交 issue 时请附上失败的步骤和运行日志末尾（`out/pinned-<date>.log`）——其中包含出口、时间和服务器原始响应，这些正是复现问题所需的全部信息。切勿附上密钥。**[提交 issue](../../issues)**，欢迎 PR。

## 📄 许可证

MIT © 2026 —— 参见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey 贡献者

</div>