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

**Массовое создание аккаунтов Leo Studio с автоматически сгенерированными API-ключами — OpenAI-совместимый инференс (DeepSeek, GLM, Kimi, Hunyuan) + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный тариф](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-7-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>





---

## ✨ Зачем это нужно

Leo Studio (`api.leostudio.cc`) выдаёт каждому аккаунту **75 000 кредитов**, а используемая единица — *один аккаунт на ключ*: квота привязана к **аккаунту**, а не ко второму ключу того же аккаунта. Регистрация открыта, **без капчи** (`turnstile_check: false`) и подтверждается по e-mail; **ежедневной отметки нет** (`签到功能未启用`). Этот инструмент проходит весь путь без участия человека, через ваш список прокси, и записывает ключ только после реального завершения запроса в группе **`国模`**.

## 🎁 Бесплатный тариф — сколько вы получаете

**Каждый новый аккаунт Leo Studio несёт 75 000 кредитов — единоразово, без пополнения, без карты.**

| Пункт | Измерено |
| --- | --- |
| Начисление при регистрации | **75 000 кредитов** (`GET /api/user/self` → `quota: 75000`) |
| Ежедневная отметка | **отключена** (`{"success":false,"message":"签到功能未启用"}`) — начисление единоразовое |
| Капча при регистрации | **отсутствует** (`turnstile_check: false`) |
| E-mail, который принимает панель | **Gmail** (или QQ) — одноразовые домены отклоняются; письмо с подтверждением приходит от `leostudio2026@163.com` (тема «Leo Studio邮箱验证邮件», 6-символьный код, срок действия 10 минут) |
| Группа, обслуживающая текстовые модели | **`国模`** — группа `default` свежего аккаунта обслуживает только линейку изображений, и запрос чата там отвечает `503 model_not_found` |
| Единица, которая масштабируется | **один аккаунт = один ключ** → `--count N` на самом деле означает «N бесплатных аккаунтов» (квота на аккаунт) |

> 💡 Бесплатный тариф устанавливается Leo Studio и может измениться. Проверяйте актуальные цифры на [leostudio.cc](https://leostudio.cc) — и пусть решает собственный шлюз инструмента:

```bash
node src/cli.js verify                 # каждый ключ в keys.txt повторно тестируется против живого API
```

## 🤖 Модели — все 7

`GET https://api.leostudio.cc/v1/models` с созданным ключом в группе **`国模`** обслуживает **7 текстовых моделей** (зафиксировано в [`models.json`](models.json)):

| Модель | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

Группа `default` свежего аккаунта обслуживает линейку изображений (`gpt-image-2*`, `sd-2.5-ch*`) — запрос чата там отвечает `503 model_not_found … under group default`; инструмент назначает каждый токен в **`国模`**, чтобы разблокировать 7 текстовых моделей выше. 8 идентификаторов изображений (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) **не** являются текстовыми моделями и не подтверждают ключ.

Повторно проверено **2026-10-19** против живой матрицы чата (3 ключа × 5 выходов): текущий набор ключей отвечает `403 insufficient_user_quota` на постоянном ключе и `503` на двух других, поэтому **здесь ни один идентификатор не добавлен и не удалён** — строка с галочкой выше — это собственное проверенное измерение репозитория с ответом чата 200 (`2026-10-15`), а ограничение баланса не является отказом модели.

## 🧪 Как использовать API

Базовый URL — **`https://api.leostudio.cc/v1`** — OpenAI-совместимый, поэтому работает всё, что говорит на языке OpenAI (SDK, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Быстрый старт

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

`node src/cli.js help` перечисляет задачи; каждая задача читает свои флаги. Ключи попадают в `keys.txt`, по одному в строке; детали по каждому аккаунту (e-mail, шаги, результат проверки) попадают в `accounts.json`. Настройки из лаунчера сохраняются в `launcher.config.json`.

### 🖱️ Лаунчер

```bash
node src/launcher.js
```

Меню поверх модулей задач: **mint**, **verify**, **probe**, **9Router**. Оно запрашивает `count` (ключей за запуск) и `concurrency` (параллельных выходов), хранит их в `launcher.config.json` и запускает `node src/cli.js <task>` с нужными флагами. Пункт меню **6** запускает регистрацию в 9Router напрямую.

## ✅ Проверено в работе — каждый ключ тестируется

Измерено **2026-10-15**: **3 аккаунта → 3 ключа, один ключ на аккаунт**. Каждый ключ был проверен после его появления, через выход, *независимый* от создания, с `verify.independent=true` в `accounts.json`.

| Проверка | Запрос | Результат |
| --- | --- | --- |
| Аутентификация + список моделей | `GET https://api.leostudio.cc/v1/models` (в группе **`国模`**) | **200** + 7 идентификаторов текстовых моделей |
| Реальное завершение | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + сообщение ассистента |

Проверка выполняется **с выхода, отличного от того, который создал ключ**, поэтому она не может пройти на основе состояния сессии, а не действительности ключа. `node src/cli.js verify` воспроизводит ровно эту проверку для вашего собственного файла. Ключ записывается в `keys.txt` только после того, как обе проверки ответят 200.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Шаг | Запрос | Примечания |
| --- | --- | --- |
| Шлюзы | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Почтовый ящик | [Emailnator](https://www.emailnator.com) | свежий адрес Gmail на каждый аккаунт, чтение через ваши выходы; код находится в **теле** письма (поле `content`), а не в теме |
| Отправка кода | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Регистрация | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Вход | `POST /api/user/login` | возвращает **`data.access_token` (JWT)** + cookie `new_api_refresh`; один только cookie отвечает `401 AUTH_UNAUTHORIZED` — требуется Bearer |
| Self | `GET /api/user/self` (Bearer + cookie) | `quota: 75000` на аккаунт |
| Создание токена | `POST /api/token/` (Bearer) | сначала маскированный ключ (`tbCR******…`) |
| Раскрытие ключа | `POST /api/token/{id}/key` (Bearer) | 48-символьный ключ в открытом виде |
| Группа | `PUT /api/token/{id}` | назначение в **`国模`** (`unlimited_quota: true`) — иначе ретранслятор отвечает `401 Invalid token`, даже если на аккаунте есть квота |
| Доказательство | `GET /v1/models` + `POST /v1/chat/completions` | оба с выхода, *отличного* от создания; только после этого ключ добавляется в `keys.txt` |

## ⚙️ Опции CLI

Весь код находится в `src/` — запускайте его из корня репозитория как `node src/<file>.js`.

| Инструмент | Флаги |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — диспетчер; `--connect-9router` регистрирует ключи в 9Router после задачи; собственные флаги каждой задачи через `node src/<task> --help` |
| `src/mint.js` | тонкая обёртка → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (по умолчанию `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | глубокое исследование одного аккаунта или ключа |
| `src/launcher.js` | интерактивно: mint / verify / probe / settings — `count` и `concurrency` сохраняются в `launcher.config.json` |

## 🛰️ За прокси

* Выходы берутся из `proxies.txt` (одна строка на выход, `scheme://host:port`, поддерживается `user:pass@`, комментарии `#` игнорируются). Один и тот же пул питает вызовы панели, проверку ключей и чтение почты; инструменты никогда не обращаются к провайдеру напрямую.
* **Отбор — это и есть работа.** Каждый аккаунт закрепляет первый выход, который подтверждает `GET /api/status` против хоста панели, а проверка закрепляет *другой* подтверждённый выход — мёртвый выход выводит себя из строя, и аккаунт продолжает на следующем.
* Почтовый ящик ([Emailnator](https://www.emailnator.com)) — это сторонний сервис временной почты, а не панель; его API также читается через ваши выходы.
* Письмо с подтверждением приходит от **`leostudio2026@163.com`** (не от домена панели); первый код в пакете может идти несколько минут — инструмент ждёт, а не отправляет повторно, потому что повторная отправка аннулирует код в пути.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный в работе ключ на строку — игнорируется git |
| `accounts.json` | почтовый ящик, шаги, отметка, оба выхода проверки на аккаунт — игнорируется git |
| `models.json` | свежий снимок `/v1/models` в группе `国模` — игнорируется git |
| `proxies.txt` | ваши выходы, по одному в строке — игнорируется git |
| `out/pinned-<date>.log` | журнал каждого запуска (выход, тайминг, точный ответ сервера) — игнорируется git |
| `src/mint.js` · `src/probe-key.js` | движки, к которым обращается CLI |
| `src/connect-9router.js` | регистрирует ключи из `keys.txt` как подключения 9Router |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый OpenAI-совместимый маршрутизатор. Leo Studio OpenAI-совместим, поэтому зарегистрируйте его один раз и используйте каждый ключ:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Каждый ключ в `keys.txt` становится одним подключением узла провайдера `leostudio` (`--api-key <key>` регистрирует один ключ вместо этого, `--model <id>` переопределяет значение по умолчанию). Затем выберите модель внутри 9Router:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Значения по умолчанию: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, модель по умолчанию `deepseek-v4-flash`.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Что даёт провайдер | 75 000 кредитов на аккаунт · 7 текстовых моделей (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · каждый ключ проверен в работе |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 7 идентификаторов моделей на указанной ниже конечной точке, в пределах лимитов вашего тарифа. Квота привязана к **аккаунту**, и именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | OpenAI-совместимый: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Ваши данные | связь происходит только с leostudio.cc и настроенным вами бэкендом почтового ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Откройте issue с указанием неудавшегося шага и хвоста журнала запуска (`out/pinned-<date>.log`) — в нём есть выход, тайминг и точный ответ сервера, то есть всё необходимое для воспроизведения сбоя. Никогда не прикрепляйте ключ. **[Открыть issue](../../issues)** — и PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>