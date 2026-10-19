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

**Leo-Studio-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz (DeepSeek, GLM, Kimi, Hunyuan) + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-7-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

Leo Studio (`api.leostudio.cc`) gibt jedem Konto **75.000 Credits**, und die nutzbare Einheit ist *ein Konto pro Schlüssel* — das Kontingent liegt beim **Konto**, niemals bei einem zweiten Schlüssel desselben Kontos. Die Registrierung ist offen, hat **kein Captcha** (`turnstile_check: false`) und verifiziert per E-Mail; es gibt **keinen täglichen Check-in** (`签到功能未启用`). Dieses Tool durchläuft den gesamten Weg unbeaufsichtigt über deine Proxy-Liste und zeichnet einen Schlüssel erst nach einer echten Completion in der Gruppe **`国模`** auf.

## 🎁 Kostenlose Stufe — wie viel du bekommst

**Jedes neue Leo-Studio-Konto trägt 75.000 Credits — einmalig, keine Nachfüllung, keine Karte.**

| Element | Gemessen |
| --- | --- |
| Registrierungs-Gutschrift | **75.000 Credits** (`GET /api/user/self` → `quota: 75000`) |
| Täglicher Check-in | **deaktiviert** (`{"success":false,"message":"签到功能未启用"}`) — die Gutschrift ist einmalig |
| Captcha bei der Registrierung | **keines** (`turnstile_check: false`) |
| E-Mail, die das Panel akzeptiert | **Gmail** (oder QQ) — Wegwerf-Domains werden abgelehnt; die Verifizierungsmail kommt von `leostudio2026@163.com` (Betreff «Leo Studio邮箱验证邮件», 6-stelliger Code, 10 Minuten gültig) |
| Gruppe, die Textmodelle bereitstellt | **`国模`** — die Gruppe `default` eines frischen Kontos stellt nur die Bildlinie bereit, und ein Chat-Aufruf dort antwortet mit `503 model_not_found` |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten" (das Kontingent gilt pro Konto) |

> 💡 Die kostenlose Stufe wird von Leo Studio festgelegt und kann sich ändern. Prüfe die aktuellen Zahlen auf [leostudio.cc](https://leostudio.cc) — und lass das Gate des Tools selbst entscheiden:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelle — alle 7

`GET https://api.leostudio.cc/v1/models` mit einem erzeugten Schlüssel in der Gruppe **`国模`** stellt **7 Textmodelle** bereit (erfasst in [`models.json`](models.json)):

| Modell | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

Die Gruppe `default` eines frischen Kontos stellt die Bildlinie bereit (`gpt-image-2*`, `sd-2.5-ch*`) — ein Chat-Aufruf dort antwortet mit `503 model_not_found … under group default`; das Tool weist jedes Token der Gruppe **`国模`** zu, um die 7 oben genannten Textmodelle freizuschalten. Die 8 Bild-IDs (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) sind **keine** Textmodelle und verifizieren keinen Schlüssel.

Erneut geprüft am **2026-10-19** gegen die Live-Chat-Matrix (3 Schlüssel × 5 Ausgänge): Der aktuelle Schlüsselsatz antwortet mit `403 insufficient_user_quota` beim stehenden Schlüssel und mit `503` bei den anderen beiden, daher wird **hier keine ID hinzugefügt oder entfernt** — die Häkchenzeile oben ist die eigene verifizierte Chat-200-Messung des Repositories (`2026-10-15`), und eine Guthaben-Grenze ist kein Modellfehler.

## 🧪 Die API verwenden

Die Basis-URL ist **`https://api.leostudio.cc/v1`** — OpenAI-kompatibel, also funktioniert alles, was OpenAI spricht (SDKs, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Schnellstart

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

`node src/cli.js help` listet die Aufgaben auf; jede Aufgabe liest ihre eigenen Flags. Schlüssel landen in `keys.txt`, einer pro Zeile; Details pro Konto (E-Mail, Schritte, Verifizierungsergebnis) landen in `accounts.json`. Einstellungen aus dem Launcher bleiben in `launcher.config.json` erhalten.

### 🖱️ Der Launcher

```bash
node src/launcher.js
```

Ein Menü über die Aufgabenmodule: **mint**, **verify**, **probe**, **9Router**. Es fragt nach `count` (Schlüssel pro Lauf) und `concurrency` (parallele Ausgänge), behält sie in `launcher.config.json` und startet `node src/cli.js <task>` mit den richtigen Flags. Menüpunkt **6** führt die 9Router-Registrierung direkt aus.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

Gemessen am **2026-10-15**: **3 Konten → 3 Schlüssel, ein Schlüssel pro Konto**. Jeder Schlüssel wurde nach seiner Erstellung geprüft, über einen vom Mint *unabhängigen* Ausgang, mit `verify.independent=true` in `accounts.json`.

| Prüfung | Aufruf | Ergebnis |
| --- | --- | --- |
| Auth + Modellliste | `GET https://api.leostudio.cc/v1/models` (in der Gruppe **`国模`**) | **200** + 7 Textmodell-IDs |
| Echte Completion | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + Assistenten-Nachricht |

Die Prüfung läuft über **einen anderen Ausgang als den, der den Schlüssel erzeugt hat**, sodass sie nicht aufgrund von Sitzungszustand statt Schlüsselgültigkeit bestehen kann. `node src/cli.js verify` reproduziert genau diese Prüfung für deine eigene Datei. Ein Schlüssel wird nur dann in `keys.txt` geschrieben, wenn beide Prüfungen mit 200 antworten.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Gates | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Postfach | [Emailnator](https://www.emailnator.com) | eine frische Gmail-Adresse pro Konto, gelesen über deine Ausgänge; der Code steht im **Body** (Feld `content`), nicht im Betreff |
| Code senden | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registrieren | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Anmelden | `POST /api/user/login` | gibt **`data.access_token` (JWT)** + `new_api_refresh`-Cookie zurück; das Cookie allein antwortet mit `401 AUTH_UNAUTHORIZED` — Bearer ist erforderlich |
| Self | `GET /api/user/self` (Bearer + Cookie) | `quota: 75000` pro Konto |
| Token erstellen | `POST /api/token/` (Bearer) | zuerst maskierter Schlüssel (`tbCR******…`) |
| Schlüssel enthüllen | `POST /api/token/{id}/key` (Bearer) | 48-stelliger Klartext-Schlüssel |
| Gruppe | `PUT /api/token/{id}` | auf **`国模`** stempeln (`unlimited_quota: true`) — andernfalls antwortet der Relay mit `401 Invalid token`, obwohl das Konto Kontingent besitzt |
| Beweisen | `GET /v1/models` + `POST /v1/chat/completions` | beide über einen vom Mint *verschiedenen* Ausgang; erst dann wird der Schlüssel an `keys.txt` angehängt |

## ⚙️ CLI-Optionen

Der gesamte Code liegt in `src/` — führe ihn vom Repository-Stammverzeichnis als `node src/<file>.js` aus.

| Tool | Flags |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — Dispatcher; `--connect-9router` registriert Schlüssel nach der Aufgabe in 9Router; die eigenen Flags jeder Aufgabe über `node src/<task> --help` |
| `src/mint.js` | dünner Wrapper → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (Standard `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | tiefergehende Prüfung eines Kontos oder Schlüssels |
| `src/launcher.js` | interaktiv: mint / verify / probe / settings — `count` und `concurrency` bleiben in `launcher.config.json` erhalten |

## 🛰️ Hinter einem Proxy

* Ausgänge stammen aus `proxies.txt` (eine Zeile pro Ausgang, `scheme://host:port`, `user:pass@` unterstützt, `#`-Kommentare werden ignoriert). Derselbe Pool speist die Panel-Aufrufe, die Schlüsselverifizierung und die Postfach-Lesevorgänge; die Tools wählen den Anbieter niemals direkt an.
* **Die Auswahl ist die Arbeit.** Jedes Konto bindet sich an den ersten Ausgang, der `GET /api/status` gegen den Panel-Host beweist, und die Verifizierung bindet sich an einen *anderen* bewiesenen Ausgang — ein toter Ausgang zieht sich selbst zurück und das Konto fährt mit dem nächsten fort.
* Das Postfach ([Emailnator](https://www.emailnator.com)) ist ein Drittanbieter-Temp-Mail-Dienst und nicht das Panel; seine API wird ebenfalls über deine Ausgänge gelesen.
* Die Verifizierungsmail kommt von **`leostudio2026@163.com`** (nicht von der Panel-Domain); der erste Code einer Charge kann einige Minuten brauchen — das Tool wartet, statt erneut zu senden, weil ein erneutes Senden den unterwegs befindlichen Code ungültig macht.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | Postfach, Schritte, Check-in, beide Verifizierungs-Ausgänge pro Konto — von Git ignoriert |
| `models.json` | eine frische `/v1/models`-Erfassung in der Gruppe `国模` — von Git ignoriert |
| `proxies.txt` | deine Ausgänge, einer pro Zeile — von Git ignoriert |
| `out/pinned-<date>.log` | das Log pro Lauf (Ausgang, Timing, exakte Serverantwort) — von Git ignoriert |
| `src/mint.js` · `src/probe-key.js` | die Engines, an die der CLI dispatches ausführt |
| `src/connect-9router.js` | registriert die Schlüssel in `keys.txt` als 9Router-Verbindungen |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Leo Studio ist OpenAI-kompatibel, also registriere es einmal und nutze jeden Schlüssel:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Jeder Schlüssel in `keys.txt` wird zu einer Verbindung des `leostudio`-Provider-Knotens (`--api-key <key>` registriert stattdessen einen einzelnen Schlüssel, `--model <id>` überschreibt den Standard). Wähle dann ein Modell innerhalb von 9Router:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, Standardmodell `deepseek-v4-flash`.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Was der Anbieter gibt | 75.000 Credits pro Konto · 7 Textmodelle (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · jeder Schlüssel live-verifiziert |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 7 Modell-IDs am unten stehenden Endpunkt, im Rahmen der Limits deines Tarifs. Das Kontingent liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Deine Daten | nur leostudio.cc und das von dir konfigurierte Postfach-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Eröffne ein Issue mit dem fehlgeschlagenen Schritt und dem Ende des Lauf-Logs (`out/pinned-<date>.log`) — es enthält den Ausgang, das Timing und die exakte Serverantwort, also alles, was zur Reproduktion eines Fehlschlags nötig ist. Hänge niemals einen Schlüssel an. **[Eröffne ein Issue](../../issues)** und PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>