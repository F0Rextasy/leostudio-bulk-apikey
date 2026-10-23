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

**Crea cuentas de Leo Studio en masa con claves API autogeneradas — inferencia compatible con OpenAI (DeepSeek, GLM, Kimi, Hunyuan) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-7-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

Leo Studio (`api.leostudio.cc`) entrega a cada cuenta **75.000 créditos** y la unidad utilizable es *una cuenta por clave* — la cuota vive en la **cuenta**, nunca en una segunda clave de la misma cuenta. El registro está abierto, **no tiene captcha** (`turnstile_check: false`) y verifica por correo electrónico; **no hay check-in diario** (`签到功能未启用`). Esta herramienta recorre todo el camino sin supervisión, a través de tu lista de proxies, y solo registra una clave tras una completion real en el grupo **`国模`**.

## 🎁 Nivel gratuito — cuánto obtienes

**Cada nueva cuenta de Leo Studio lleva 75.000 créditos — de una sola vez, sin recarga, sin tarjeta.**

| Elemento | Medido |
| --- | --- |
| Concesión al registrarse | **75.000 créditos** (`GET /api/user/self` → `quota: 75000`) |
| Check-in diario | **deshabilitado** (`{"success":false,"message":"签到功能未启用"}`) — la concesión es de una sola vez |
| Captcha al registrarse | **ninguno** (`turnstile_check: false`) |
| Correo que acepta el panel | **Gmail** (o QQ) — se rechazan los dominios desechables; el correo de verificación llega desde `leostudio2026@163` (asunto «Leo Studio邮箱验证邮件», código de 6 caracteres, validez de 10 min) |
| Grupo que sirve modelos de texto | **`国模`** — el grupo `default` de una cuenta nueva solo sirve la línea de imágenes y una llamada de chat allí responde `503 model_not_found` |
| La unidad que escala | **una cuenta = una clave** → `--count N` es realmente "N cuentas gratuitas" (la cuota es por cuenta) |

> 💡 El nivel gratuito lo define Leo Studio y puede cambiar. Consulta los números en vivo en [leostudio.cc](https://leostudio.cc) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelos — los 7

`GET https://api.leostudio.cc/v1/models` con una clave generada en el grupo **`国模`** sirve **7 modelos de texto** (capturados en [`models.json`](models.json)):

| Modelo | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

El grupo `default` de una cuenta nueva sirve la línea de imágenes (`gpt-image-2*`, `sd-2.5-ch*`) — una llamada de chat allí responde `503 model_not_found … under group default`; la herramienta asigna cada token a **`国模`** para desbloquear los 7 modelos de texto anteriores. Los 8 ids de imagen (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) **no** son modelos de texto y no verifican una clave.

Revisado de nuevo el **2026-10-19** contra la matriz de chat en vivo (3 claves × 5 salidas): el conjunto de claves actual responde `403 insufficient_user_quota` en la clave vigente y `503` en las otras dos, por lo que **no se añade ni se elimina ningún id aquí** — la fila marcada arriba es la medición chat-200 verificada del propio repositorio (`2026-10-15`), y un muro de saldo no es un fallo de modelo.

## 🧪 Cómo usar la API

La URL base es **`https://api.leostudio.cc/v1`** — compatible con OpenAI, así que cualquier cosa que hable OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Inicio rápido

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

`node src/cli.js help` lista las tareas; cada tarea lee sus propios flags. Las claves quedan en `keys.txt`, una por línea; el detalle por cuenta (correo, pasos, resultado de verificación) queda en `accounts.json`. Los ajustes del launcher persisten en `launcher.config.json`.

### 🖱️ El launcher

```bash
node src/launcher.js
```

Un menú sobre los módulos de tareas: **mint**, **verify**, **probe**, **9Router**. Pide `count` (claves por ejecución) y `concurrency` (salidas en paralelo), los guarda en `launcher.config.json` y lanza `node src/cli.js <task>` con los flags correctos. El elemento de menú **6** ejecuta directamente el registro en 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

Medido el **2026-10-15**: **3 cuentas → 3 claves, una clave por cuenta**. Cada clave se comprobó después de existir, en una salida *independiente* de la generación, con `verify.independent=true` en `accounts.json`.

| Comprobación | Llamada | Resultado |
| --- | --- | --- |
| Auth + lista de modelos | `GET https://api.leostudio.cc/v1/models` (en el grupo **`国模`**) | **200** + 7 ids de modelos de texto |
| Completion real | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + mensaje del asistente |

La comprobación se ejecuta desde **una salida distinta de la que generó la clave**, por lo que no puede pasar por el estado de la sesión en lugar de por la validez de la clave. `node src/cli.js verify` reproduce exactamente esa comprobación para tu propio archivo. Una clave se escribe en `keys.txt` solo después de que ambas comprobaciones respondan 200.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| Puertas | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Buzón | [Emailnator](https://www.emailnator.com) | una dirección Gmail nueva por cuenta, leída a través de tus salidas; el código está en el **cuerpo** (campo `content`), no en el asunto |
| Enviar código | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registro | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Login | `POST /api/user/login` | devuelve **`data.access_token` (JWT)** + cookie `new_api_refresh`; la cookie por sí sola responde `401 AUTH_UNAUTHORIZED` — se requiere Bearer |
| Self | `GET /api/user/self` (Bearer + cookie) | `quota: 75000` por cuenta |
| Crear token | `POST /api/token/` (Bearer) | primero la clave enmascarada (`tbCR******…`) |
| Revelar clave | `POST /api/token/{id}/key` (Bearer) | clave en texto plano de 48 caracteres |
| Grupo | `PUT /api/token/{id}` | asignar a **`国模`** (`unlimited_quota: true`) — de lo contrario el relay responde `401 Invalid token` aunque la cuenta tenga cuota |
| Probar | `GET /v1/models` + `POST /v1/chat/completions` | ambos en una salida *distinta* de la generación; solo entonces la clave se añade a `keys.txt` |

## ⚙️ Opciones de la CLI

Todo el código vive en `src/` — ejecútalo desde la raíz del repositorio como `node src/<file>.js`.

| Herramienta | Flags |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — despachador; `--connect-9router` registra las claves en 9Router tras la tarea; los flags propios de cada tarea vía `node src/<task> --help` |
| `src/mint.js` | envoltorio fino → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (por defecto `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | sonda profunda de una cuenta o clave |
| `src/launcher.js` | interactivo: mint / verify / probe / settings — `count` y `concurrency` persisten en `launcher.config.json` |

## 🛰️ Detrás de un proxy

* Las salidas provienen de `proxies.txt` (una línea por salida, `scheme://host:port`, se admite `user:pass@`, los comentarios `#` se ignoran). El mismo pool alimenta las llamadas al panel, la verificación de claves y las lecturas del buzón; las herramientas nunca marcan al proveedor directamente.
* **El filtrado es el trabajo.** Cada cuenta fija la primera salida que demuestra `GET /api/status` contra el host del panel, y la verificación fija una salida *distinta* ya probada — una salida muerta se retira sola y la cuenta continúa con la siguiente.
* El buzón ([Emailnator](https://www.emailnator.com)) es un servicio de correo temporal de terceros en lugar del panel; su API también se lee a través de tus salidas.
* El correo de verificación llega desde **`leostudio2026@163`** (no desde el dominio del panel); el primer código de un lote puede tardar unos minutos en llegar — la herramienta espera en lugar de reenviar, porque un reenvío invalida el código en curso.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | buzón, pasos, check-in, ambas salidas de verificación por cuenta — ignorado por git |
| `models.json` | una captura fresca de `/v1/models` en el grupo `国模` — ignorado por git |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `out/pinned-<date>.log` | el log por ejecución (salida, tiempos, respuesta exacta del servidor) — ignorado por git |
| `src/mint.js` · `src/probe-key.js` | los motores a los que despacha la CLI |
| `src/connect-9router.js` | registra las claves de `keys.txt` como conexiones de 9Router |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI. Leo Studio es compatible con OpenAI, así que regístralo una vez y usa todas las claves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456

```

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado compatible con OpenAI. Leo Studio es compatible con OpenAI, así que regístralo una vez y usa todas las claves:

```bash
node src/connect-omniroute.js --base http://localhost:20128 --password 123456

# or: node src/cli.js mint --count 3 --connect-9router
```

Cada clave de `keys.txt` se convierte en una conexión del nodo proveedor `leostudio` (`--api-key <key>` registra una sola clave en su lugar, `--model <id>` sobrescribe el valor por defecto). Luego elige un modelo dentro de 9Router:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Valores por defecto: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, modelo por defecto `deepseek-v4-flash`.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Qué da el proveedor | 75.000 créditos por cuenta · 7 modelos de texto (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · cada clave verificada en vivo |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 7 ids de modelo en el endpoint de abajo, con los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | Compatible con OpenAI: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con leostudio.cc y el backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Abre un issue con el paso que falla y la cola del log de ejecución (`out/pinned-<date>.log`) — contiene la salida, los tiempos y la respuesta exacta del servidor, que es todo lo necesario para reproducir un fallo. Nunca adjuntes una clave. **[Abre un issue](../../issues)** y los PRs son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>