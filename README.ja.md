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

**自動生成された API キーで Leo Studio アカウントを一括作成 — OpenAI 互換の推論（DeepSeek、GLM、Kimi、Hunyuan）+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-7-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 イシュー](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

Leo Studio（`api.leostudio.cc`）はすべてのアカウントに **75,000 クレジット** を付与し、使用可能な単位は *1 アカウントにつき 1 キー* です — クォータは **アカウント** に紐づき、同じアカウントの 2 つ目のキーには決して紐づきません。登録はオープンで、**キャプチャはなく**（`turnstile_check: false`）、メールで認証します。**毎日のチェックインはありません**（`签到功能未启用`）。このツールは、あなたのプロキシリストを経由して、この全行程を無人で実行し、**`国模`** グループでの実際の補完が成功した後にのみキーを記録します。

## 🎁 無料枠 — どれだけ得られるか

**新しい Leo Studio アカウントにはそれぞれ 75,000 クレジットが付与されます — 一度きりで、補充もカードも不要です。**

| 項目 | 実測値 |
| --- | --- |
| 登録時の付与 | **75,000 クレジット**（`GET /api/user/self` → `quota: 75000`） |
| 毎日のチェックイン | **無効**（`{"success":false,"message":"签到功能未启用"}`）— 付与は一度きり |
| 登録時のキャプチャ | **なし**（`turnstile_check: false`） |
| パネルが受け付けるメール | **Gmail**（または QQ）— 使い捨てドメインは拒否されます。認証メールは `leostudio2026@163.com` から届きます（件名「Leo Studio邮箱验证邮件」、6 文字のコード、有効期限 10 分） |
| テキストモデルを提供するグループ | **`国模`** — 新規アカウントの `default` グループは画像ラインのみを提供し、そこでチャットを呼び出すと `503 model_not_found` が返ります |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」です（クォータはアカウント単位） |

> 💡 無料枠は Leo Studio が設定するもので、変更される可能性があります。最新の数値は [leostudio.cc](https://leostudio.cc) で確認してください — そしてツール自身のゲートに判断させてください:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 モデル — 全 7 個

**`国模`** グループで発行済みのキーを使い `GET https://api.leostudio.cc/v1/models` を呼び出すと、**7 個のテキストモデル** が提供されます（[`models.json`](models.json) にキャプチャ済み）:

| モデル | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

新規アカウントの `default` グループは画像ライン（`gpt-image-2*`、`sd-2.5-ch*`）を提供します — そこでチャットを呼び出すと `503 model_not_found … under group default` が返ります。ツールは各トークンを **`国模`** に割り当てて、上記の 7 個のテキストモデルを解放します。8 個の画像 ID（`gpt-image-2`、`gpt-image-2.5*`、`sd-2.0-ch1`、`sd-2.5-ch*`）はテキストモデルでは **なく**、キーを検証しません。

**2026-10-19** にライブのチャットマトリクス（3 キー × 5 出口）に対して再確認しました: 現在のキーセットは常設キーで `403 insufficient_user_quota`、他の 2 つで `503` を返すため、**ここで ID の追加も削除も行いません** — 上記のチェック行はリポジトリ自身が検証したチャット 200 の測定値（`2026-10-15`）であり、残高の壁はモデルの障害ではありません。

## 🧪 API の使い方

ベース URL は **`https://api.leostudio.cc/v1`** です — OpenAI 互換なので、OpenAI を話すものなら何でも動作します（SDK、Cursor、OpenCode、Kilo Code など）。

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

## 🛠 クイックスタート

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

`node src/cli.js help` はタスクの一覧を表示します。各タスクは独自のフラグを読み取ります。キーは `keys.txt` に 1 行ずつ保存されます。アカウントごとの詳細（メール、ステップ、検証結果）は `accounts.json` に保存されます。ランチャーの設定は `launcher.config.json` に永続化されます。

### 🖱️ ランチャー

```bash
node src/launcher.js
```

タスクモジュールの上に重なるメニュー: **mint**、**verify**、**probe**、**9Router**。`count`（実行あたりのキー数）と `concurrency`（並列出口）を尋ね、それらを `launcher.config.json` に保持し、適切なフラグを付けて `node src/cli.js <task>` を起動します。メニュー項目 **6** は 9Router 登録を直接実行します。

## ✅ 動作検証済み — すべてのキーがテストされています

**2026-10-15** に測定: **3 アカウント → 3 キー、1 アカウントにつき 1 キー**。すべてのキーは、それが存在した後に、発行とは *独立した* 出口から検証され、`accounts.json` に `verify.independent=true` が記録されています。

| チェック | 呼び出し | 結果 |
| --- | --- | --- |
| 認証 + モデル一覧 | `GET https://api.leostudio.cc/v1/models`（**`国模`** グループ上） | **200** + 7 個のテキストモデル ID |
| 実際の補完 | `POST https://api.leostudio.cc/v1/chat/completions`（`deepseek-v4-flash`） | **200** + アシスタントメッセージ |

このチェックは **キーを発行したものとは異なる出口** から実行されるため、キーの有効性ではなくセッション状態で合格することはできません。`node src/cli.js verify` は、あなた自身のファイルに対してまさにこのチェックを再現します。キーは両方のチェックが 200 を返した後にのみ `keys.txt` に書き込まれます。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| ゲート | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| メールボックス | [Emailnator](https://www.emailnator.com) | アカウントごとに新しい Gmail アドレスを、あなたの出口経由で読み取ります。コードは件名ではなく **本文**（`content` フィールド）にあります |
| コード送信 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 登録 | `POST /api/user/register`（`username`、`password`、`email`、`verification_code`） | `{"success":true}` |
| ログイン | `POST /api/user/login` | **`data.access_token`（JWT）** + `new_api_refresh` Cookie を返します。Cookie だけでは `401 AUTH_UNAUTHORIZED` が返ります — Bearer が必要です |
| セルフ | `GET /api/user/self`（Bearer + Cookie） | アカウントごとに `quota: 75000` |
| トークン作成 | `POST /api/token/`（Bearer） | まずマスクされたキー（`tbCR******…`） |
| キー公開 | `POST /api/token/{id}/key`（Bearer） | 48 文字の平文キー |
| グループ | `PUT /api/token/{id}` | **`国模`** にスタンプ（`unlimited_quota: true`）— そうしないと、アカウントにクォータがあってもリレーが `401 Invalid token` を返します |
| 証明 | `GET /v1/models` + `POST /v1/chat/completions` | どちらも発行とは *異なる* 出口から。その後にのみキーが `keys.txt` に追記されます |

## ⚙️ CLI オプション

すべてのコードは `src/` にあります — リポジトリのルートから `node src/<file>.js` として実行してください。

| ツール | フラグ |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — ディスパッチャ。`--connect-9router` はタスク後にキーを 9Router に登録します。各タスク独自のフラグは `node src/<task> --help` で確認できます |
| `src/mint.js` | 薄いラッパー → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N`（3）· `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX`（デフォルト `leostudio2026@163`）· `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 1 つのアカウントまたはキーの詳細プローブ |
| `src/launcher.js` | 対話式: mint / verify / probe / settings — `count` と `concurrency` は `launcher.config.json` に永続化されます |

## 🛰️ プロキシの背後で

* 出口は `proxies.txt` から取得します（1 行につき 1 出口、`scheme://host:port`、`user:pass@` 対応、`#` コメントは無視）。同じプールがパネル呼び出し、キー検証、メールボックス読み取りに供給されます。ツールがプロバイダに直接接続することは決してありません。
* **スクリーニングが作業の中心です。** 各アカウントは、パネルホストに対して `GET /api/status` を証明した最初の出口を固定し、検証は *別の* 証明済み出口を固定します — 死んだ出口は自ら引退し、アカウントは次の出口で続行します。
* メールボックス（[Emailnator](https://www.emailnator.com)）はパネルではなくサードパーティの一時メールサービスです。その API もあなたの出口経由で読み取られます。
* 認証メールは **`leostudio2026@163.com`** から届きます（パネルのドメインではありません）。バッチの最初のコードは届くまで数分かかることがあります — ツールは再送せずに待ちます。再送すると送信中のコードが無効になるためです。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行につき 1 つのライブ検証済みキー — git 管理外 |
| `accounts.json` | アカウントごとのメールボックス、ステップ、チェックイン、両方の検証出口 — git 管理外 |
| `models.json` | `国模` グループでの最新の `/v1/models` キャプチャ — git 管理外 |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git 管理外 |
| `out/pinned-<date>.log` | 実行ごとのログ（出口、タイミング、正確なサーバー応答）— git 管理外 |
| `src/mint.js` · `src/probe-key.js` | CLI がディスパッチするエンジン |
| `src/connect-9router.js` | `keys.txt` のキーを 9Router 接続として登録します |

## 🔌 9Router に接続する

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。Leo Studio は OpenAI 互換なので、一度登録すればすべてのキーを使えます:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` のすべてのキーが `leostudio` プロバイダノードの 1 つの接続になります（`--api-key <key>` は代わりに単一のキーを登録し、`--model <id>` はデフォルトを上書きします）。その後、9Router 内でモデルを選択してください:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--prefix leostudio`、`--base-url https://api.leostudio.cc/v1`、デフォルトモデル `deepseek-v4-flash`。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダ | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 プロバイダが提供するもの | アカウントごとに 75,000 クレジット · 7 個のテキストモデル（deepseek-v4-flash、kimi-k3、glm-5.3-flash）· すべてのキーがライブ検証済み |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 以下のエンドポイントで、あなたのプランの制限内で 7 個のモデル ID。クォータは **アカウント** に紐づくため、このツールが 1 キーにつき 1 アカウントを作成するのです |
| 🌐 API の形 | OpenAI 互換: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 あなたのデータ | 接続されるのは leostudio.cc と、あなたが設定した受信トレイバックエンドのみです。キーはあなたのマシンに留まります |

## 🐞 イシュー

失敗したステップと実行ログの末尾（`out/pinned-<date>.log`）を添えてイシューを開いてください — そこには出口、タイミング、正確なサーバー応答が含まれており、失敗を再現するために必要なすべてが揃っています。キーは決して添付しないでください。**[イシューを開く](../../issues)** — PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照してください。

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>