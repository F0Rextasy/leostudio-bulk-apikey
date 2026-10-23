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

**批量创建 Leo Studio 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理服务（DeepSeek、GLM、Kimi、Hunyuan）+ 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费额度](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-7-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题反馈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

Leo Studio（`api.leostudio.cc`）为每个账户提供 **75,000 积分**，而可用的单位是*每个密钥对应一个账户* —— 配额存在于**账户**上，绝不会存在于同一账户的第二个密钥上。注册是开放的，**没有验证码**（`turnstile_check: false`），并通过电子邮件验证；**没有每日签到**（`签到功能未启用`）。本工具通过你的代理列表无人值守地走完整个流程，并且只有在 **`国模`** 分组上完成一次真实推理后才会记录密钥。

## 🎁 免费额度 —— 你能获得多少

**每个新的 Leo Studio 账户都带有 75,000 积分 —— 一次性发放，不补充，无需银行卡。**

| 项目 | 实测值 |
| --- | --- |
| 注册赠送 | **75,000 积分**（`GET /api/user/self` → `quota: 75000`） |
| 每日签到 | **已禁用**（`{"success":false,"message":"签到功能未启用"}`）—— 赠送是一次性的 |
| 注册验证码 | **无**（`turnstile_check: false`） |
| 面板接受的邮箱 | **Gmail**（或 QQ）—— 一次性域名会被拒绝；验证邮件来自 `leostudio2026@<mail>`（主题为 «Leo Studio邮箱验证邮件»，6 位字符验证码，10 分钟有效期） |
| 提供文本模型的分组 | **`国模`** —— 新账户的 `default` 分组仅提供图像线路，在那里发起对话调用会返回 `503 model_not_found` |
| 可扩展的单位 | **一个账户 = 一个密钥** → `--count N` 实际上就是「N 个免费账户」（配额按账户计算） |

> 💡 免费额度由 Leo Studio 设定，可能会变化。请在 [leostudio.cc](https://leostudio.cc) 查看实时数值 —— 并让工具自身的校验关卡来判定：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 —— 全部 7 个

使用在 **`国模`** 分组上铸造的密钥调用 `GET https://api.leostudio.cc/v1/models` 会返回 **7 个文本模型**（已捕获于 [`models.json`](models.json)）：

| 模型 ID | 系列 | 备注 |
| --- | --- | --- |
| `deepseek-v4-flash` | DeepSeek | 验证器的默认对话模型 |
| `deepseek-v4.1-flash` | DeepSeek | 下一代 flash |
| `glm-5.2` | Z.ai (GLM) | |
| `glm-5.3-flash` | Z.ai (GLM) | |
| `kimi-k3` | Moonshot | |
| `hy3` | Hunyuan | |
| `hy4-preview` | Hunyuan | 预览版 |

新账户的 `default` 分组提供图像线路（`gpt-image-2*`、`sd-2.5-ch*`）—— 在那里发起对话调用会返回 `503 model_not_found … under group default`；本工具会将每个令牌分配到 **`国模`** 以解锁上述 7 个文本模型。这 8 个图像 ID（`gpt-image-2`、`gpt-image-2.5*`、`sd-2.0-ch1`、`sd-2.5-ch*`）**不是**文本模型，无法用于验证密钥。

## 🧪 如何使用 API

基础 URL 是 **`https://api.leostudio.cc/v1`** —— 兼容 OpenAI，因此任何支持 OpenAI 的工具都能使用（SDK、Cursor、OpenCode、Kilo Code 等）。

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
printf 'socks5://127.0.0.1:1080\n' > proxies.txt   # optional — without it the tool runs direct

# 2) go — one run mints one key per fresh account
node src/launcher.js             # interactive menu: mint / verify / probe / settings
# or drive it directly:
node src/cli.js mint --count 3   # fresh accounts → one verified key each
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js probe            # deep probe of a single account or key
```

`node src/cli.js help` 会列出所有任务；每个任务读取自己的标志参数。密钥写入 `keys.txt`，每行一个；每个账户的详细信息（邮箱、步骤、验证结果）写入 `accounts.json`。启动器中的设置会持久化到 `launcher.config.json`。

### 🖱️ 启动器

```bash
node src/launcher.js
```

一个覆盖各任务模块的菜单：**mint**、**verify**、**probe**、**9Router**。它会询问 `count`（每次运行的密钥数）和 `concurrency`（并行出口数），将它们保存在 `launcher.config.json` 中，并以正确的标志参数启动 `node src/cli.js <task>`。菜单项 **6** 直接运行 9Router 注册。

## ✅ 已验证可用 —— 每个密钥都经过测试

实测于 **2026-10-15**：**每个账户铸造了自己的密钥，一个账户一个密钥**。每个密钥在生成后都经过检查，检查使用的出口与铸造时*不同*，且 `accounts.json` 中 `verify.independent=true`。

| 检查项 | 调用 | 结果 |
| --- | --- | --- |
| 认证 + 模型列表 | `GET https://api.leostudio.cc/v1/models`（在 **`国模`** 分组上） | **200** + 7 个文本模型 ID |
| 真实推理 | `POST https://api.leostudio.cc/v1/chat/completions`（`deepseek-v4-flash`） | **200** + 助手消息 |

该检查从**与铸造密钥时不同的出口**运行，因此它不可能仅凭会话状态而非密钥有效性通过。`node src/cli.js verify` 会针对你自己的文件复现完全相同的检查。只有当两项检查都返回 200 时，密钥才会被写入 `keys.txt`。

> **质量关卡。** 这里的每个密钥在被写入 `keys.txt` 之前都通过了实时 `chat-200`
> （绝不提供失效密钥）。路由组合在模型层面遵循同样的规则：只有当模型返回 `chat-200`
> **且能调用工具**时，条目才会被添加 —— 不支持工具的模型、失效的密钥或失效的提供方
> 会被丢弃而不是添加。可随时重新运行验证步骤；失败会被报告，绝不隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 关卡 | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| 邮箱 | [Emailnator](https://www.emailnator.com) | 每个账户一个全新的 Gmail 地址，通过你的出口读取；验证码在**正文**（`content` 字段）中，而非主题中 |
| 发送验证码 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 注册 | `POST /api/user/register`（`username`、`password`、`email`、`verification_code`） | `{"success":true}` |
| 登录 | `POST /api/user/login` | 返回 **`data.access_token`（JWT）** + `new_api_refresh` cookie；仅凭 cookie 会返回 `401 AUTH_UNAUTHORIZED` —— 必须使用 Bearer |
| 自身信息 | `GET /api/user/self`（Bearer + cookie） | 每个账户 `quota: 75000` |
| 创建令牌 | `POST /api/token/`（Bearer） | 首先返回掩码密钥（`tbCR******…`） |
| 显示密钥 | `POST /api/token/{id}/key`（Bearer） | 48 位字符的明文密钥 |
| 分组 | `PUT /api/token/{id}` | 标记为 **`国模`**（`unlimited_quota: true`）—— 否则即使账户有配额，中继也会返回 `401 Invalid token` |
| 验证 | `GET /v1/models` + `POST /v1/chat/completions` | 两者都在与铸造时*不同*的出口上运行；只有通过后密钥才会被追加到 `keys.txt` |

## ⚙️ CLI 选项

所有代码都在 `src/` 中 —— 从仓库根目录以 `node src/<file>.js` 运行。

| 工具 | 标志参数 |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` —— 调度器；`--connect-9router` 在任务后将密钥注册到 9Router；每个任务自己的标志参数可通过 `node src/<task> --help` 查看 |
| `src/mint.js` | 薄封装 → `provider-cli.js` / `mint-newapi-pinned.js` —— `--count N`（3）· `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX`（默认 `leostudio2026@163`）· `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 对单个账户或密钥进行深度探测 |
| `src/launcher.js` | 交互式：mint / verify / probe / settings —— `count` 和 `concurrency` 持久化在 `launcher.config.json` 中 |

## 🛰️ 在代理之后

**可选 —— 大规模使用时推荐（按 IP 限制、封禁）。** 本工具在没有代理时也能工作。

* **有代理池时：** 传入 `--pool <file>`（或将出口放入 `proxies.txt`），每个请求都会经过该列表中的一个出口 —— 失效线路会使该次尝试失败，工具会转向下一个。
* **没有代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接。注册、密钥铸造或验证都不会有任何变化 —— 只是数据包的发出位置不同。

* 出口来自 `proxies.txt`（每行一个出口，`scheme://host:port`，支持 `user:pass@`，忽略 `#` 注释）。提供代理池时，同一个池会供面板调用、密钥验证和邮箱读取使用；没有代理池时，工具直接连接。
* **筛选就是工作本身。** 每个账户会固定第一个能对面板主机证明 `GET /api/status` 的出口，而验证会固定一个*不同的*已验证出口 —— 失效的出口会自行淘汰，账户继续使用下一个。
* 邮箱（[Emailnator](https://www.emailnator.com)）是第三方临时邮件服务而非面板；提供代理池时，其 API 也通过你的出口读取。
* 验证邮件来自 **`leostudio2026@163`**（不是面板域名）；一批中的第一个验证码可能需要几分钟才能到达 —— 工具会等待而不是重新发送，因为重新发送会使正在传输中的验证码失效。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经过实时验证的密钥 —— 已被 git 忽略 |
| `accounts.json` | 每个账户的邮箱、步骤、签到、两个验证出口 —— 已被 git 忽略 |
| `models.json` | 在 `国模` 分组上对 `/v1/models` 的最新捕获 —— 已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个 —— 已被 git 忽略 |
| `out/pinned-<date>.log` | 每次运行的日志（出口、时间、服务器的确切应答）—— 已被 git 忽略 |
| `src/mint.js` · `src/probe-key.js` | CLI 调度到的引擎 |
| `src/connect-9router.js` | 将 `keys.txt` 中的密钥注册为 9Router 连接 |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。Leo Studio 兼容 OpenAI，因此只需注册一次即可使用所有密钥：

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` 中的每个密钥都会成为 `leostudio` 提供方节点的一个连接（`--api-key <key>` 则只注册单个密钥，`--model <id>` 覆盖默认值）。然后在 9Router 中选择一个模型：

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix leostudio`、`--base-url https://api.leostudio.cc/v1`，默认模型 `deepseek-v4-flash`。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。Leo Studio 兼容 OpenAI，因此只需注册一次即可使用所有密钥：

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

`keys.txt` 中的每个密钥都会成为 `leostudio` 提供方节点的一个连接（`--api-key <key>` 则只注册单个密钥，`--model <id>` 覆盖默认值）。然后在 OmniRoute 中选择一个模型：

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--prefix leostudio`、`--base-url https://api.leostudio.cc/v1`，默认模型 `deepseek-v4-flash`。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供方 | **Leo Studio** —— [leostudio.cc](https://leostudio.cc) |
| 🎁 提供方给予什么 | 每个账户 75,000 积分 · 7 个文本模型（deepseek-v4-flash、kimi-k3、glm-5.3-flash）· 每个密钥都经过验证 |
| 🔑 一个密钥能给你什么 | 一个作用域为其自身账户的 API 密钥：下方端点上的 7 个模型 ID，受你套餐的限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 你的数据 | 仅联系 leostudio.cc 和你配置的邮箱后端；密钥保留在你的机器上 |

## 🐞 问题反馈

提交 issue 时请附上失败的步骤和运行日志尾部（`out/pinned-<date>.log`）—— 它包含出口、时间和服务器的确切应答，这是复现问题所需的一切。切勿附上密钥。**[提交 issue](../../issues)**，欢迎 PR。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>