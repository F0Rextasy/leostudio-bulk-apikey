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

**자동 생성된 API 키로 Leo Studio 계정을 대량 생성 — OpenAI 호환 추론(DeepSeek, GLM, Kimi, Hunyuan) + 9Router 커넥터.**

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

## ✨ 이 도구가 존재하는 이유

Leo Studio(`api.leostudio.cc`)는 모든 계정에 **75,000 크레딧**을 지급하며, 사용 가능한 단위는 *키당 계정 하나*입니다 — 할당량은 **계정**에 존재하고, 같은 계정의 두 번째 키에는 절대 존재하지 않습니다. 가입은 공개되어 있고 **캡차가 없으며**(`turnstile_check: false`) 이메일로 인증합니다. **일일 체크인은 없습니다**(`签到功能未启用`). 이 도구는 프록시 목록을 통해 전체 경로를 무인으로 진행하며, **`国模`** 그룹에서 실제 완료가 이루어진 뒤에만 키를 기록합니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

**모든 신규 Leo Studio 계정에는 75,000 크레딧이 있습니다 — 일회성이며, 재충전도 카드도 없습니다.**

| 항목 | 측정값 |
| --- | --- |
| 가입 지급 | **75,000 크레딧** (`GET /api/user/self` → `quota: 75000`) |
| 일일 체크인 | **비활성화** (`{"success":false,"message":"签到功能未启用"}`) — 지급은 일회성 |
| 가입 시 캡차 | **없음** (`turnstile_check: false`) |
| 패널이 허용하는 이메일 | **Gmail**(또는 QQ) — 일회용 도메인은 거부됨; 인증 메일은 `leostudio2026@163`에서 도착(제목 «Leo Studio邮箱验证邮件», 6자리 코드, 10분 유효) |
| 텍스트 모델을 제공하는 그룹 | **`国模`** — 신규 계정의 `default` 그룹은 이미지 라인만 제공하며, 거기서 채팅 호출은 `503 model_not_found`를 응답 |
| 확장되는 단위 | **계정 하나 = 키 하나** → `--count N`은 실제로 "N개의 무료 계정" (할당량은 계정당) |

> 💡 무료 티어는 Leo Studio가 설정하며 변경될 수 있습니다. 실시간 수치는 [leostudio.cc](https://leostudio.cc)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하게 하세요:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 모델 — 7개 전부

`GET https://api.leostudio.cc/v1/models`를 **`国模`** 그룹의 발급된 키로 호출하면 **7개의 텍스트 모델**을 제공합니다([`models.json`](models.json)에 캡처됨):

| 모델 | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

신규 계정의 `default` 그룹은 이미지 라인(`gpt-image-2*`, `sd-2.5-ch*`)을 제공합니다 — 거기서 채팅 호출은 `503 model_not_found … under group default`를 응답합니다. 도구는 각 토큰을 **`国模`**에 할당하여 위의 7개 텍스트 모델을 사용할 수 있게 합니다. 8개의 이미지 id(`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`)는 텍스트 모델이 **아니며** 키를 검증하지 않습니다.

**2026-10-19**에 라이브 채팅 매트릭스(키 3개 × 출구 5개)로 재확인했습니다: 현재 키 세트는 상시 키에서 `403 insufficient_user_quota`를, 나머지 두 키에서 `503`을 응답하므로 **여기서 id를 추가하거나 제거하지 않습니다** — 위의 체크 표시 행은 저장소 자체의 검증된 채팅-200 측정값(`2026-10-15`)이며, 잔액 장벽은 모델 장애가 아닙니다.

## 🧪 API 사용 방법

기본 URL은 **`https://api.leostudio.cc/v1`** 입니다 — OpenAI 호환이므로 OpenAI를 지원하는 모든 것(SDK, Cursor, OpenCode, Kilo Code 등)이 작동합니다.

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
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) go — one run mints one key per fresh account
node src/launcher.js             # interactive menu: mint / verify / probe / settings
# or drive it directly:
node src/cli.js mint --count 3   # fresh accounts → one verified key each
node src/cli.js verify           # re-check the keys already on disk
node src/cli.js probe            # deep probe of a single account or key
```

`node src/cli.js help`는 작업 목록을 보여줍니다; 각 작업은 자체 플래그를 읽습니다. 키는 한 줄에 하나씩 `keys.txt`에 저장됩니다; 계정별 세부 정보(이메일, 단계, 검증 결과)는 `accounts.json`에 저장됩니다. 런처의 설정은 `launcher.config.json`에 유지됩니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

작업 모듈 위의 메뉴: **mint**, **verify**, **probe**, **9Router**. `count`(실행당 키 수)와 `concurrency`(병렬 출구)를 묻고, 이를 `launcher.config.json`에 유지하며, 올바른 플래그로 `node src/cli.js <task>`를 실행합니다. 메뉴 항목 **6**은 9Router 등록을 직접 실행합니다.

## ✅ 검증됨 — 모든 키가 테스트됩니다

**2026-10-15** 측정: **계정 3개 → 키 3개, 계정당 키 하나**. 모든 키는 키가 존재한 뒤, mint와 *독립적인* 출구에서 검증되었으며, `accounts.json`에 `verify.independent=true`가 있습니다.

| 검사 | 호출 | 결과 |
| --- | --- | --- |
| 인증 + 모델 목록 | `GET https://api.leostudio.cc/v1/models` (**`国模`** 그룹에서) | **200** + 텍스트 모델 id 7개 |
| 실제 완료 | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + 어시스턴트 메시지 |

검사는 **키를 발급한 출구와 다른 출구**에서 실행되므로, 키 유효성이 아니라 세션 상태로 통과할 수 없습니다. `node src/cli.js verify`는 자신의 파일에 대해 정확히 그 검사를 재현합니다. 키는 두 검사가 모두 200을 응답한 뒤에만 `keys.txt`에 기록됩니다.

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
| 메일함 | [Emailnator](https://www.emailnator.com) | 계정마다 신규 Gmail 주소, 출구를 통해 읽음; 코드는 제목이 아니라 **본문**(`content` 필드)에 있음 |
| 코드 전송 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 등록 | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| 로그인 | `POST /api/user/login` | **`data.access_token` (JWT)** + `new_api_refresh` 쿠키 반환; 쿠키만으로는 `401 AUTH_UNAUTHORIZED` 응답 — Bearer 필요 |
| 본인 정보 | `GET /api/user/self` (Bearer + 쿠키) | 계정당 `quota: 75000` |
| 토큰 생성 | `POST /api/token/` (Bearer) | 먼저 마스킹된 키(`tbCR******…`) |
| 키 공개 | `POST /api/token/{id}/key` (Bearer) | 48자 평문 키 |
| 그룹 | `PUT /api/token/{id}` | **`国模`**로 지정(`unlimited_quota: true`) — 그렇지 않으면 계정에 할당량이 있어도 릴레이가 `401 Invalid token`을 응답 |
| 증명 | `GET /v1/models` + `POST /v1/chat/completions` | 둘 다 mint와 *다른* 출구에서; 그런 다음에만 키가 `keys.txt`에 추가됨 |

## ⚙️ CLI 옵션

모든 코드는 `src/`에 있습니다 — 저장소 루트에서 `node src/<file>.js`로 실행하세요.

| 도구 | 플래그 |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — 디스패처; `--connect-9router`는 작업 후 9Router에 키를 등록; 각 작업의 자체 플래그는 `node src/<task> --help`로 확인 |
| `src/mint.js` | 얇은 래퍼 → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (기본값 `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 하나의 계정 또는 키에 대한 심층 프로브 |
| `src/launcher.js` | 대화형: mint / verify / probe / 설정 — `count`와 `concurrency`는 `launcher.config.json`에 유지 |

## 🛰️ 프록시 뒤에서

* 출구는 `proxies.txt`에서 옵니다(출구당 한 줄, `scheme://host:port`, `user:pass@` 지원, `#` 주석 무시). 동일한 풀이 패널 호출, 키 검증, 메일함 읽기에 공급됩니다; 도구는 제공자에 직접 연결하지 않습니다.
* **출구 심사가 작업의 핵심입니다.** 각 계정은 패널 호스트에 대해 `GET /api/status`를 증명하는 첫 출구를 고정하고, 검증은 *다른* 증명된 출구를 고정합니다 — 죽은 출구는 스스로 은퇴하고 계정은 다음 출구에서 계속됩니다.
* 메일함([Emailnator](https://www.emailnator.com))은 패널이 아니라 타사 임시 메일 서비스입니다; 해당 API도 출구를 통해 읽습니다.
* 인증 메일은 **`leostudio2026@163`**(패널 도메인이 아님)에서 도착합니다; 배치의 첫 코드는 도착하는 데 몇 분이 걸릴 수 있습니다 — 도구는 코드를 다시 보내지 않고 기다립니다. 재전송은 진행 중인 코드를 무효화하기 때문입니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄에 하나씩 라이브 검증된 키 — git에서 무시됨 |
| `accounts.json` | 계정별 메일함, 단계, 체크인, 두 검증 출구 — git에서 무시됨 |
| `models.json` | `国模` 그룹에서 새로 캡처한 `/v1/models` — git에서 무시됨 |
| `proxies.txt` | 출구, 한 줄에 하나 — git에서 무시됨 |
| `out/pinned-<date>.log` | 실행별 로그(출구, 타이밍, 정확한 서버 응답) — git에서 무시됨 |
| `src/mint.js` · `src/probe-key.js` | CLI가 디스패치하는 엔진 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅되는 OpenAI 호환 라우터입니다. Leo Studio는 OpenAI 호환이므로 한 번 등록하고 모든 키를 사용하세요:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt`의 모든 키는 `leostudio` 제공자 노드의 연결 하나가 됩니다(대신 `--api-key <key>`는 단일 키를 등록하고, `--model <id>`는 기본값을 재정의합니다). 그런 다음 9Router 내에서 모델을 선택하세요:

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
| 🎁 제공자가 주는 것 | 계정당 75,000 크레딧 · 텍스트 모델 7개(deepseek-v4-flash, kimi-k3, glm-5.3-flash) · 모든 키 라이브 검증 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 API 키 하나: 아래 엔드포인트의 7개 모델 id, 플랜 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 계정 하나를 만드는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 데이터 | leostudio.cc와 구성한 메일함 백엔드에만 접촉합니다; 키는 사용자 머신에 남습니다 |

## 🐞 이슈

실패한 단계와 실행 로그 끝부분(`out/pinned-<date>.log`)을 포함하여 이슈를 열어 주세요 — 로그에는 출구, 타이밍, 정확한 서버 응답이 담겨 있어 실패를 재현하는 데 필요한 모든 것입니다. 키는 절대 첨부하지 마세요. **[이슈 열기](../../issues)** 및 PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey 기여자

</div>