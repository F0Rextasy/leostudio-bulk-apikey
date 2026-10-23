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

**자동 생성된 API 키로 Leo Studio 계정을 대량 생성 — OpenAI 호환 추론 (DeepSeek, GLM, Kimi, Hunyuan) + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-7-of-them) · [🧪 API 사용법](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

Leo Studio(`api.leostudio.cc`)는 모든 계정에 **75,000 크레딧**을 지급하며, 사용 가능한 단위는 *계정당 하나의 키*입니다 — 할당량은 **계정**에 존재하며, 같은 계정의 두 번째 키에는 절대 존재하지 않습니다. 가입은 개방되어 있고 **캡차가 없으며**(`turnstile_check: false`), 이메일로 인증합니다. **일일 출석 체크는 없습니다**(`签到功能未启用`). 이 도구는 프록시 목록을 통해 전체 과정을 무인으로 진행하며, **`国模`** 그룹에서 실제 완료 응답을 받은 후에만 키를 기록합니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

**모든 신규 Leo Studio 계정에는 75,000 크레딧이 지급됩니다 — 일회성이며, 충전도 카드도 없습니다.**

| 항목 | 측정값 |
| --- | --- |
| 가입 지급 | **75,000 크레딧** (`GET /api/user/self` → `quota: 75000`) |
| 일일 출석 체크 | **비활성화됨** (`{"success":false,"message":"签到功能未启用"}`) — 지급은 일회성 |
| 가입 시 캡차 | **없음** (`turnstile_check: false`) |
| 패널이 허용하는 이메일 | **Gmail** (또는 QQ) — 일회용 도메인은 거부됨; 인증 메일은 `leostudio2026@<mail>`에서 도착 («Leo Studio邮箱验证邮件» 제목, 6자리 코드, 10분 유효) |
| 텍스트 모델을 제공하는 그룹 | **`国模`** — 신규 계정의 `default` 그룹은 이미지 라인만 제공하며, 여기서 채팅 호출은 `503 model_not_found`를 반환 |
| 확장되는 단위 | **계정 하나 = 키 하나** → `--count N`은 실제로 "N개의 무료 계정" (할당량은 계정당) |

> 💡 무료 티어는 Leo Studio가 설정하며 변경될 수 있습니다. 실시간 수치는 [leostudio.cc](https://leostudio.cc)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 7개 전부

**`国模`** 그룹에서 발급된 키로 `GET https://api.leostudio.cc/v1/models`를 호출하면 **7개의 텍스트 모델**을 제공합니다 ([`models.json`](models.json)에 캡처됨):

| 모델 ID | 계열 | 비고 |
| --- | --- | --- |
| `deepseek-v4-flash` | DeepSeek | 검증기의 기본 채팅 모델 |
| `deepseek-v4.1-flash` | DeepSeek | 차세대 flash |
| `glm-5.2` | Z.ai (GLM) | |
| `glm-5.3-flash` | Z.ai (GLM) | |
| `kimi-k3` | Moonshot | |
| `hy3` | Hunyuan | |
| `hy4-preview` | Hunyuan | 프리뷰 |

신규 계정의 `default` 그룹은 이미지 라인(`gpt-image-2*`, `sd-2.5-ch*`)을 제공합니다 — 여기서 채팅 호출은 `503 model_not_found … under group default`를 반환합니다. 도구는 각 토큰을 **`国模`**에 할당하여 위의 7개 텍스트 모델을 사용할 수 있게 합니다. 8개의 이미지 ID(`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`)는 텍스트 모델이 **아니며** 키를 검증하지 않습니다.

## 🧪 API 사용법

베이스 URL은 **`https://api.leostudio.cc/v1`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것(SDK, Cursor, OpenCode, Kilo Code 등)이 작동합니다.

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

## 🛠 빠른 시작

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

`node src/cli.js help`는 작업 목록을 표시하며, 각 작업은 자체 플래그를 읽습니다. 키는 `keys.txt`에 한 줄에 하나씩 저장되고, 계정별 세부 정보(이메일, 단계, 검증 결과)는 `accounts.json`에 저장됩니다. 런처의 설정은 `launcher.config.json`에 유지됩니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈 위에 놓인 메뉴: **mint**, **verify**, **probe**, **9Router**. `count`(실행당 키 수)와 `concurrency`(병렬 출구)를 묻고, 이를 `launcher.config.json`에 저장하며, 올바른 플래그로 `node src/cli.js <task>`를 실행합니다. 메뉴 항목 **6**은 9Router 등록을 직접 실행합니다.

## ✅ 검증된 작동 — 모든 키가 테스트됨

측정일 **2026-10-15**: **각 계정이 자체 키를 발급했으며, 계정당 하나의 키**입니다. 모든 키는 생성된 후, 발급과 *독립적인* 출구에서, `accounts.json`의 `verify.independent=true`로 검사되었습니다.

| 검사 | 호출 | 결과 |
| --- | --- | --- |
| 인증 + 모델 목록 | `GET https://api.leostudio.cc/v1/models` (**`国模`** 그룹에서) | **200** + 7개 텍스트 모델 ID |
| 실제 완료 | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + 어시스턴트 메시지 |

검사는 **키를 발급한 출구와 다른 출구**에서 실행되므로, 키 유효성이 아닌 세션 상태로 통과할 수 없습니다. `node src/cli.js verify`는 여러분의 파일에 대해 정확히 그 검사를 재현합니다. 키는 두 검사 모두 200을 반환한 후에만 `keys.txt`에 기록됩니다.

> **품질 게이트.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 실시간 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 같은 규칙을 따릅니다: 항목은
> **모델이 `chat-200`을 반환하고 도구를 호출할 수 있는 경우에만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키 또는 죽은 제공자는 추가되지 않고 제거됩니다. 언제든지 검증 단계를 다시 실행하세요;
> 실패는 보고되며, 절대 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 게이트 | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| 메일함 | [Emailnator](https://www.emailnator.com) | 계정당 새 Gmail 주소, 출구를 통해 읽음; 코드는 제목이 아닌 **본문**(`content` 필드)에 있음 |
| 코드 전송 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 등록 | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| 로그인 | `POST /api/user/login` | **`data.access_token` (JWT)** + `new_api_refresh` 쿠키 반환; 쿠키만으로는 `401 AUTH_UNAUTHORIZED`를 반환 — Bearer가 필요 |
| 자기 정보 | `GET /api/user/self` (Bearer + cookie) | 계정당 `quota: 75000` |
| 토큰 생성 | `POST /api/token/` (Bearer) | 먼저 마스킹된 키 (`tbCR******…`) |
| 키 공개 | `POST /api/token/{id}/key` (Bearer) | 48자 평문 키 |
| 그룹 | `PUT /api/token/{id}` | **`国模`**로 설정 (`unlimited_quota: true`) — 그렇지 않으면 계정에 할당량이 있어도 릴레이가 `401 Invalid token`을 반환 |
| 증명 | `GET /v1/models` + `POST /v1/chat/completions` | 둘 다 발급과 *다른* 출구에서; 그 후에만 키가 `keys.txt`에 추가됨 |

## ⚙️ CLI 옵션

모든 코드는 `src/`에 있습니다 — 저장소 루트에서 `node src/<file>.js`로 실행하세요.

| 도구 | 플래그 |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — 디스패처; `--connect-9router`는 작업 후 9Router에 키를 등록; 각 작업의 자체 플래그는 `node src/<task> --help`로 확인 |
| `src/mint.js` | 얇은 래퍼 → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (기본 `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 단일 계정 또는 키의 심층 프로브 |
| `src/launcher.js` | 대화형: mint / verify / probe / settings — `count`와 `concurrency`는 `launcher.config.json`에 유지됨 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 대규모에서는 권장됨 (IP별 제한, 차단).** 이 도구는 프록시 없이도 작동합니다.

* **풀이 있는 경우:** `--pool <file>`을 전달하거나(또는 `proxies.txt`에 출구를 넣으면) 모든 요청이 해당 목록의 출구를 통해 나갑니다 — 죽은 회선은 해당 시도를 실패시키고 도구는 다음으로 넘어갑니다.
* **풀이 없는 경우:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다. 가입, 키 발급 또는 검증에 대해 달라지는 것은 없습니다 — 패킷이 나가는 위치만 다릅니다.

* 출구는 `proxies.txt`에서 가져옵니다 (한 줄에 하나의 출구, `scheme://host:port`, `user:pass@` 지원, `#` 주석 무시). 동일한 풀이 제공되면 패널 호출, 키 검증 및 메일함 읽기에 공급됩니다; 풀이 없으면 도구는 직접 연결합니다.
* **선별이 핵심 작업입니다.** 각 계정은 패널 호스트에 대해 `GET /api/status`를 증명하는 첫 번째 출구를 고정하고, 검증은 *다른* 증명된 출구를 고정합니다 — 죽은 출구는 스스로 은퇴하고 계정은 다음 출구에서 계속합니다.
* 메일함([Emailnator](https://www.emailnator.com))은 패널이 아닌 서드파티 임시 메일 서비스입니다; 풀이 제공되면 해당 API도 출구를 통해 읽습니다.
* 인증 메일은 **`leostudio2026@163`**에서 도착합니다 (패널 도메인이 아님); 배치의 첫 코드는 도착하는 데 몇 분이 걸릴 수 있습니다 — 도구는 재전송 대신 기다립니다, 재전송은 진행 중인 코드를 무효화하기 때문입니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나의 실시간 검증된 키 — git-ignored |
| `accounts.json` | 계정별 메일함, 단계, 출석 체크, 두 검증 출구 — git-ignored |
| `models.json` | `国模` 그룹에서 새로 캡처한 `/v1/models` — git-ignored |
| `proxies.txt` | 출구 목록, 한 줄에 하나 — git-ignored |
| `out/pinned-<date>.log` | 실행별 로그 (출구, 타이밍, 정확한 서버 응답) — git-ignored |
| `src/mint.js` · `src/probe-key.js` | CLI가 디스패치하는 엔진 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅, OpenAI 호환 라우터입니다. Leo Studio는 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt`의 모든 키는 `leostudio` 제공자 노드의 하나의 연결이 됩니다 (`--api-key <key>`는 단일 키를 대신 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 9Router 내에서 모델을 선택하세요:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, 기본 모델 `deepseek-v4-flash`.

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅, OpenAI 호환 라우터입니다. Leo Studio는 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-omniroute
```

`keys.txt`의 모든 키는 `leostudio` 제공자 노드의 하나의 연결이 됩니다 (`--api-key <key>`는 단일 키를 대신 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 OmniRoute 내에서 모델을 선택하세요:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, 기본 모델 `deepseek-v4-flash`.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 제공자가 주는 것 | 계정당 75,000 크레딧 · 7개 텍스트 모델 (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · 모든 키 검증됨 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 하나의 API 키: 아래 엔드포인트의 7개 모델 ID, 요금제 한도 내에서. 할당량은 **계정**에 존재하며, 이것이 바로 이 도구가 키당 하나의 계정을 생성하는 이유입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 데이터 | leostudio.cc와 구성한 메일함 백엔드만 접촉됩니다; 키는 여러분의 컴퓨터에 남습니다 |

## 🐞 이슈

실패한 단계와 실행 로그 꼬리(`out/pinned-<date>.log`)를 포함하여 이슈를 열어주세요 — 출구, 타이밍, 정확한 서버 응답이 담겨 있어 실패를 재현하는 데 필요한 모든 것입니다. 키는 절대 첨부하지 마세요. **[이슈 열기](../../issues)** 및 PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>