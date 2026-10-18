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

**Créez en masse des comptes Leo Studio avec des clés API générées automatiquement — inférence compatible OpenAI (DeepSeek, GLM, Kimi, Hunyuan) + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Offre gratuite](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-7-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Pourquoi cet outil existe

Leo Studio (`api.leostudio.cc`) attribue à chaque compte **75 000 crédits** et l'unité utilisable est *un compte par clé* — le quota vit sur le **compte**, jamais sur une seconde clé du même compte. L'inscription est ouverte, **sans captcha** (`turnstile_check: false`) et se vérifie par e-mail ; il n'y a **pas de check-in quotidien** (`签到功能未启用`). Cet outil parcourt tout le chemin sans intervention, via votre liste de proxies, et n'enregistre une clé qu'après une vraie complétion sur le groupe **`国模`**.

## 🎁 Offre gratuite — combien vous obtenez

**Chaque nouveau compte Leo Studio porte 75 000 crédits — en une seule fois, sans recharge, sans carte.**

| Élément | Mesuré |
| --- | --- |
| Crédit d'inscription | **75 000 crédits** (`GET /api/user/self` → `quota: 75000`) |
| Check-in quotidien | **désactivé** (`{"success":false,"message":"签到功能未启用"}`) — le crédit est unique |
| Captcha à l'inscription | **aucun** (`turnstile_check: false`) |
| E-mail accepté par le panel | **Gmail** (ou QQ) — les domaines jetables sont refusés ; le mail de vérification arrive de `leostudio2026@163.com` (objet «Leo Studio邮箱验证邮件», code de 6 caractères, validité 10 min) |
| Groupe qui sert les modèles texte | **`国模`** — le groupe `default` d'un compte neuf ne sert que la ligne image et un appel de chat y répond `503 model_not_found` |
| L'unité qui monte en échelle | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » (le quota est par compte) |

> 💡 L'offre gratuite est définie par Leo Studio et peut changer. Vérifiez les chiffres en direct sur [leostudio.cc](https://leostudio.cc) — et laissez le propre contrôle de l'outil décider :

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modèles — les 7 au complet

`GET https://api.leostudio.cc/v1/models` avec une clé générée sur le groupe **`国模`** sert **7 modèles texte** (capturés dans [`models.json`](models.json)) :

| Modèle | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

Le groupe `default` d'un compte neuf sert la ligne image (`gpt-image-2*`, `sd-2.5-ch*`) — un appel de chat y répond `503 model_not_found … under group default` ; l'outil assigne chaque token à **`国模`** pour débloquer les 7 modèles texte ci-dessus. Les 8 ids image (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) ne sont **pas** des modèles texte et ne vérifient pas une clé.

## 🧪 Comment utiliser l'API

L'URL de base est **`https://api.leostudio.cc/v1`** — compatible OpenAI, donc tout ce qui parle OpenAI fonctionne (SDKs, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Démarrage rapide

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

`node src/cli.js help` liste les tâches ; chaque tâche lit ses propres options. Les clés atterrissent dans `keys.txt`, une par ligne ; le détail par compte (e-mail, étapes, résultat de vérification) atterrit dans `accounts.json`. Les réglages du launcher persistent dans `launcher.config.json`.

### 🖱️ Le launcher

```bash
node src/launcher.js
```

Un menu au-dessus des modules de tâches : **mint**, **verify**, **probe**, **9Router**. Il demande `count` (clés par exécution) et `concurrency` (sorties parallèles), les conserve dans `launcher.config.json`, et lance `node src/cli.js <task>` avec les bonnes options. L'élément de menu **6** exécute directement l'enregistrement 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

Mesuré le **2026-10-15** : **3 comptes → 3 clés, une clé par compte**. Chaque clé a été vérifiée après son existence, sur une sortie *indépendante* de celle du mint, avec `verify.independent=true` dans `accounts.json`.

| Contrôle | Appel | Résultat |
| --- | --- | --- |
| Auth + liste des modèles | `GET https://api.leostudio.cc/v1/models` (sur le groupe **`国模`**) | **200** + 7 ids de modèles texte |
| Vraie complétion | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + message de l'assistant |

Le contrôle s'exécute depuis **une sortie différente de celle qui a généré la clé**, il ne peut donc pas réussir sur l'état de session plutôt que sur la validité de la clé. `node src/cli.js verify` reproduit exactement ce contrôle pour votre propre fichier. Une clé n'est écrite dans `keys.txt` qu'après que les deux contrôles ont répondu 200.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Notes |
| --- | --- | --- |
| Barrières | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Boîte mail | [Emailnator](https://www.emailnator.com) | une adresse Gmail neuve par compte, lue via vos sorties ; le code est dans le **corps** (champ `content`), pas dans l'objet |
| Envoi du code | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Inscription | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Connexion | `POST /api/user/login` | renvoie **`data.access_token` (JWT)** + cookie `new_api_refresh` ; le cookie seul répond `401 AUTH_UNAUTHORIZED` — le Bearer est requis |
| Self | `GET /api/user/self` (Bearer + cookie) | `quota: 75000` par compte |
| Création de token | `POST /api/token/` (Bearer) | clé masquée d'abord (`tbCR******…`) |
| Révélation de la clé | `POST /api/token/{id}/key` (Bearer) | clé en clair de 48 caractères |
| Groupe | `PUT /api/token/{id}` | assigner à **`国模`** (`unlimited_quota: true`) — sinon le relais répond `401 Invalid token` alors même que le compte détient du quota |
| Preuve | `GET /v1/models` + `POST /v1/chat/completions` | les deux sur une sortie *différente* de celle du mint ; la clé n'est ajoutée à `keys.txt` qu'ensuite |

## ⚙️ Options CLI

Tout le code vit dans `src/` — exécutez-le depuis la racine du dépôt avec `node src/<file>.js`.

| Outil | Options |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — répartiteur ; `--connect-9router` enregistre les clés dans 9Router après la tâche ; les options propres à chaque tâche via `node src/<task> --help` |
| `src/mint.js` | fine enveloppe → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (défaut `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | sonde approfondie d'un compte ou d'une clé |
| `src/launcher.js` | interactif : mint / verify / probe / settings — `count` et `concurrency` persistent dans `launcher.config.json` |

## 🛰️ Derrière un proxy

* Les sorties proviennent de `proxies.txt` (une ligne par sortie, `scheme://host:port`, `user:pass@` pris en charge, commentaires `#` ignorés). Le même pool alimente les appels au panel, la vérification des clés et les lectures de la boîte mail ; les outils ne contactent jamais le fournisseur directement.
* **Le filtrage, c'est le travail.** Chaque compte épingle la première sortie qui prouve `GET /api/status` contre l'hôte du panel, et la vérification épingle une sortie *différente* déjà prouvée — une sortie morte se retire d'elle-même et le compte continue sur la suivante.
* La boîte mail ([Emailnator](https://www.emailnator.com)) est un service de temp-mail tiers plutôt que le panel ; son API est également lue via vos sorties.
* Le mail de vérification arrive de **`leostudio2026@163.com`** (pas le domaine du panel) ; le premier code d'un lot peut mettre quelques minutes à arriver — l'outil attend au lieu de renvoyer, car un renvoi invalide le code en cours.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | boîte mail, étapes, check-in, les deux sorties de vérification par compte — ignoré par git |
| `models.json` | une capture fraîche de `/v1/models` sur le groupe `国模` — ignoré par git |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `out/pinned-<date>.log` | le journal par exécution (sortie, timing, réponse exacte du serveur) — ignoré par git |
| `src/mint.js` · `src/probe-key.js` | les moteurs vers lesquels le CLI répartit |
| `src/connect-9router.js` | enregistre les clés de `keys.txt` comme connexions 9Router |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Leo Studio est compatible OpenAI, alors enregistrez-le une fois et utilisez chaque clé :

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Chaque clé de `keys.txt` devient une connexion du nœud fournisseur `leostudio` (`--api-key <key>` enregistre une seule clé à la place, `--model <id>` remplace le modèle par défaut). Choisissez ensuite un modèle dans 9Router :

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Défauts : `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, modèle par défaut `deepseek-v4-flash`.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Ce que le fournisseur donne | 75 000 crédits par compte · 7 modèles texte (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · chaque clé vérifiée en direct |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 7 ids de modèles sur l'endpoint ci-dessous, aux limites de votre offre. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | Compatible OpenAI : `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Vos données | seuls leostudio.cc et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Ouvrez un ticket avec l'étape en échec et la fin du journal d'exécution (`out/pinned-<date>.log`) — il contient la sortie, le timing et la réponse exacte du serveur, soit tout ce qu'il faut pour reproduire un échec. Ne joignez jamais de clé. **[Ouvrir un ticket](../../issues)** et les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>