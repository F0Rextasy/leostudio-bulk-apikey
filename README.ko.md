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

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-7-of-them) · [🧪 API 사용법](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 문제 해결](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>



---

## ✨ 존재 이유

Leo Studio(`api.leostudio.cc`)는 모든 계정에 **75,000 크레딧**을 제공하며, 사용 가능한 단위는 *계정당 하나의 키*입니다. 할당량은 **계정**에 존재하며, 동일한 계정의 두 번째 키에는 할당되지 않습니다. 가입은 열려 있으며, **캡차 없음**(`turnstile_check: false`)이며 이메일로 인증됩니다. **일일 체크인 없음**(`签到功能未启用`)입니다. 이 도구는 프록시 목록을 통해 자동으로 전체 과정을 수행하며, **`국모`** 그룹에서 실제 완료 후에만 키를 기록합니다.

## 🎁 무료 티어 — 제공되는 혜택

**모든 새로운 Leo Studio 계정은 75,000 크레딧을 제공받습니다 — 일회성, 재충전 없음, 카드 필요 없음.**

| 항목 | 측정 결과 |
| --- | --- |
| 가입 보상 | **75,000 크레딧** (`GET /api/user/self` → `quota: 75000`) |
| 일일 체크인 | **비활성화** (`{"success":false,"message":"签到功能未启用"}`) — 보상은 일회성 |
| 가입 시 캡차 | **없음** (`turnstile_check: false`) |
| 패널이 수락하는 이메일 | **Gmail**(또는 QQ) — 일회용 도메인은 거부됨; 인증 메일은 `leostudio2026@163.com`에서 발송됨(제목 «Leo Studio邮箱验证邮件», 6자리 코드, 10분 유효) |
| 텍스트 모델을 제공하는 그룹 | **`국모`** — 신규 계정의 `default` 그룹은 이미지 라인만 제공하며, 해당 그룹에서 채팅 호출 시 `503 model_not_found` 응답 |
| 확장 가능한 단위 | **하나의 계정 = 하나의 키** → `--count N`은 실제로 "N개의 무료 계정"을 의미함(할당량은 계정 기준) |

> 💡 무료 티어는 Leo Studio에서 설정되며 변경될 수 있습니다. [leostudio.cc](https://leostudio.cc)에서 실시간 정보를 확인하세요 — 그리고 도구 자체의 검증을 신뢰하세요:

```bash
node src/cli.js verify                 # keys.txt의 모든 키를 실시간 API로 재검증
```

## 🤖 모델 — 총 7개

**`국모`** 그룹에서 생성된 키로 `GET https://api.leostudio.cc/v1/models`를 호출하면 **7개의 텍스트 모델**이 반환됩니다([`models.json`](models.json)에 저장됨):

| 모델 | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

신규 계정의 `default` 그룹은 이미지 라인(`gpt-image-2*`, `sd-2.5-ch*`)만 제공하며, 해당 그룹에서 채팅 호출 시 `503 model_not_found … under group default` 응답을 반환합니다. 이 도구는 각 토큰을 **`국모`** 그룹에 할당하여 위의 7개 텍스트 모델을 활성화합니다. 8개의 이미지 ID(`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`)는 **텍스트 모델이 아니며** 키 검증에 사용되지 않습니다.

## 🧪 API 사용법

기본 URL은 **`https://api.leostudio.cc/v1`** 입니다 — OpenAI 호환 형식이므로 OpenAI를 지원하는 모든 도구(SDK, Cursor, OpenCode, Kilo Code 등)에서 사용 가능합니다.

```bash
curl https://api.leostudio.cc/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
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
# 이 저장소를 복제(또는 ZIP 다운로드)한 후:
cd leostudio-bulk-apikey

# 1) 프록시 목록, 한 줄당 하나의 종단점(http://, socks5://, socks4:// 또는 host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) 실행 — 한 번의 실행으로 신규 계정당 하나의 키 생성
node src/launcher.js             # 인터랙티브 메뉴: 생성 / 검증 / 탐색 / 설정
# 또는 직접 실행:
node src/cli.js mint --count 3   # 신규 계정 → 각 계정당 하나의 검증된 키 생성
node src/cli.js verify           # 디스크에 저장된 키 재검증
node src/cli.js probe            # 단일 계정 또는 키 심층 탐색
```

`node src/cli.js help`는 작업 목록을 표시하며, 각 작업은 자체 플래그를 가집니다. 키는 `keys.txt`에 한 줄당 하나씩 저장되며, 계정별 상세 정보(이메일, 단계, 검증 결과)는 `accounts.json`에 저장됩니다. 런처 설정은 `launcher.config.json`에 유지됩니다.

### 🖱️ 런처

```bash
node src/launcher.js
```

**생성**, **검증**, **탐색**, **9Router** 작업 모듈을 위한 메뉴입니다. `count`(실행당 키 수) 및 `concurrency`(병렬 종단점 수)를 묻고, `launcher.config.json`에 저장한 후 올바른 플래그로 `node src/cli.js <task>`를 실행합니다. 메뉴 항목 **6**은 9Router 등록을 직접 실행합니다.

## ✅ 검증 완료 — 모든 키는 테스트됨

측정일 **2026-10-15**: **3개 계정 → 3개 키, 계정당 하나의 키**. 각 키는 생성 후, 키 생성에 사용된 종단점과 **독립적인** 종단점에서 `verify.independent=true`로 검증되었습니다.

| 검사 | 호출 | 결과 |
| --- | --- | --- |
| 인증 + 모델 목록 | `GET https://api.leostudio.cc/v1/models` (**`국모`** 그룹에서) | **200** + 7개 텍스트 모델 ID |
| 실제 완료 | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + 어시스턴트 응답 |

검사는 키 생성에 사용된 종단점과 **다른** 종단점에서 실행되므로, 세션 상태가 아닌 키 유효성만 통과할 수 있습니다. `node src/cli.js verify`는 사용자의 파일에 대해 동일한 검사를 재현합니다. 두 검사 모두 200 응답을 받아야만 키가 `keys.txt`에 기록됩니다.

## 🧭 작동 방식

```
수신함 (계정당 하나의 주소)                                  계정당 새 주소
   │
   ├─▶ 가입: Leo Studio 페이지 → 이메일 주소 → 수신함의 코드 / 링크
   ├─▶ 세션: 계정의 쿠키 또는 액세스 토큰 확보
   ├─▶ 키 생성: 계정의 키 엔드포인트 → 한 번만 반환되는 평문 키(즉시 디스크에 기록)
   └─▶ 실시간 검증: POST https://api.leostudio.cc/v1/chat/completions → 실제 응답 = 키 활성화 확인
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| 게이트 | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| 메일함 | [Emailnator](https://www.emailnator.com) | 계정당 새 Gmail 주소, 종단점을 통해 읽기; 코드는 제목이 아닌 **본문**(`content` 필드)에 있음 |
| 코드 전송 | `GET /api/verification?email=<plain>` | `{"success":true}` |
| 등록 | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| 로그인 | `POST /api/user/login` | **`data.access_token` (JWT)** + `new_api_refresh` 쿠키 반환; 쿠키만으로는 `401 AUTH_UNAUTHORIZED` 발생 — Bearer 필요 |
| 자기 정보 | `GET /api/user/self` (Bearer + 쿠키) | 계정당 `quota: 75000` |
| 토큰 생성 | `POST /api/token/` (Bearer) | 처음에는 마스킹된 키(`tbCR******…`) |
| 키 공개 | `POST /api/token/{id}/key` (Bearer) | 48자 평문 키 |
| 그룹 | `PUT /api/token/{id}` | **`국모`**(`unlimited_quota: true`)로 설정 — 그렇지 않으면 계정에 할당량이 있어도 릴레이가 `401 Invalid token` 응답 |
| 검증 | `GET /v1/models` + `POST /v1/chat/completions` | 모두 키 생성 종단점과 *다른* 종단점에서 실행; 그 후에야 키가 `keys.txt`에 추가됨 |

## ⚙️ CLI 옵션

모든 코드는 `src/`에 존재하며, 저장소 루트에서 `node src/<file>.js`로 실행합니다.

| 도구 | 플래그 |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — 디스패처; `--connect-9router`는 작업 후 9Router에 키 등록; 각 작업의 플래그는 `node src/<task> --help`로 확인 |
| `src/mint.js` | 얇은 래퍼 → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (기본값 `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | 단일 계정 또는 키 심층 탐색 |
| `src/launcher.js` | 인터랙티브: 생성 / 검증 / 탐색 / 설정 — `count` 및 `concurrency`는 `launcher.config.json`에 유지됨 |

## 🛰️ 프록시 뒤에서

* 종단점은 `proxies.txt`에서 제공됩니다(한 줄당 하나, `scheme://host:port`, `user:pass@` 지원, `#` 주석 무시). 동일한 풀이 패널 호출, 키 검증, 메일함 읽기에 사용되며, 도구는 제공업체에 직접 연결하지 않습니다.
* **스크리닝이 핵심 작업입니다.** 각 계정은 패널 호스트에 대해 `GET /api/status`를 성공적으로 통과한 첫 번째 종단점을 고정하며, 검증은 *다른* 검증된 종단점을 고정합니다 — 종단점이 실패하면 자동으로 제거되고 계정은 다음 종단점에서 계속 진행됩니다.
* 메일함([Emailnator](https://www.emailnator.com))은 패널이 아닌 타사 임시 메일 서비스이며, 그 API도 종단점을 통해 읽힙니다.
* 인증 메일은 **`leostudio2026@163.com`** 에서 도착합니다(패널 도메인이 아님); 배치의 첫 번째 코드는 도착하는 데 몇 분이 걸릴 수 있습니다 — 도구는 재전송 대신 대기합니다. 재전송은 진행 중인 코드를 무효화하기 때문입니다.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 한 줄당 하나의 실시간 검증된 키 — git 무시됨 |
| `accounts.json` | 메일함, 단계, 체크인, 계정당 두 종단점 검증 — git 무시됨 |
| `models.json` | `국모` 그룹에서의 새 `/v1/models` 캡처 — git 무시됨 |
| `proxies.txt` | 종단점 목록, 한 줄당 하나 — git 무시됨 |
| `out/pinned-<date>.log` | 실행별 로그(종단점, 시간, 정확한 서버 응답) — git 무시됨 |
| `src/mint.js` · `src/probe-key.js` | CLI가 디스패치하는 엔진 |
| `src/connect-9router.js` | `keys.txt`의 키를 9Router 연결로 등록 |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅 가능한 OpenAI 호환 라우터입니다. Leo Studio도 OpenAI 호환 형식이므로, 한 번 등록하면 모든 키를 사용할 수 있습니다:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# 또는: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt`의 모든 키는 `leostudio` 제공자 노드의 하나의 연결이 됩니다(`--api-key <key>`는 단일 키 등록, `--model <id>`는 기본값 재정의). 그런 다음 9Router 내에서 모델을 선택하세요:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, 기본 모델 `deepseek-v4-flash`.

## 🔑 하나의 키로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 제공자가 제공하는 것 | 계정당 75,000 크레딧 · 7개 텍스트 모델(deepseek-v4-flash, kimi-k3, glm-5.3-flash) · 모든 키 실시간 검증됨 |
| 🔑 하나의 키로 얻는 것 | 자체 계정에 범위가 지정된 하나의 API 키: 아래 엔드포인트에서 7개 모델 ID를 사용자 플랜의 제한 내에서 사용 가능. 할당량은 **계정**에 존재하므로, 이 도구는 키당 하나의 계정을 생성합니다. |
| 🌐 API 형식 | OpenAI 호환: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 사용자 데이터 | leostudio.cc 및 사용자가 구성한 메일함 백엔드만 연결됨; 키는 사용자 기기에만 유지됨 |

## 🐞 문제 해결

실패한 단계와 실행 로그 꼬리(`out/pinned-<date>.log`)를 포함하여 이슈를 열어주세요 — 종단점, 시간, 정확한 서버 응답이 포함되어 있으며, 오류 재현에 필요한 모든 정보입니다. 절대 키를 첨부하지 마세요. **[이슈 열기](../../issues)** 및 PR 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참조.

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey 기여자

</div>