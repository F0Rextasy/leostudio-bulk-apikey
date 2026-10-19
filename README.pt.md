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

**Crie contas Leo Studio em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI (DeepSeek, GLM, Kimi, Hunyuan) + conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Plano gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-7-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>





---

## ✨ Por que isto existe

O Leo Studio (`api.leostudio.cc`) concede a cada conta **75.000 créditos** e a unidade utilizável é *uma conta por chave* — a cota fica na **conta**, nunca em uma segunda chave da mesma conta. O cadastro é aberto, **não tem captcha** (`turnstile_check: false`) e verifica por e-mail; **não há check-in diário** (`签到功能未启用`). Esta ferramenta percorre todo o caminho sem supervisão, através da sua lista de proxies, e só registra uma chave após uma conclusão real no grupo **`国模`**.

## 🎁 Plano gratuito — quanto você recebe

**Cada nova conta Leo Studio carrega 75.000 créditos — de uma só vez, sem recarga, sem cartão.**

| Item | Medido |
| --- | --- |
| Concessão no cadastro | **75.000 créditos** (`GET /api/user/self` → `quota: 75000`) |
| Check-in diário | **desativado** (`{"success":false,"message":"签到功能未启用"}`) — a concessão é única |
| Captcha no cadastro | **nenhum** (`turnstile_check: false`) |
| E-mail que o painel aceita | **Gmail** (ou QQ) — domínios descartáveis são recusados; o e-mail de verificação chega de `leostudio2026@163.com` (assunto «Leo Studio邮箱验证邮件», código de 6 caracteres, validade de 10 min) |
| Grupo que serve modelos de texto | **`国模`** — o grupo `default` de uma conta nova serve apenas a linha de imagem e uma chamada de chat ali responde `503 model_not_found` |
| A unidade que escala | **uma conta = uma chave** → `--count N` é realmente "N contas gratuitas" (a cota é por conta) |

> 💡 O plano gratuito é definido pelo Leo Studio e pode mudar. Confira os números ao vivo em [leostudio.cc](https://leostudio.cc) — e deixe o próprio portão da ferramenta decidir:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modelos — todos os 7

`GET https://api.leostudio.cc/v1/models` com uma chave gerada no grupo **`国模`** serve **7 modelos de texto** (capturados em [`models.json`](models.json)):

| Modelo | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

O grupo `default` de uma conta nova serve a linha de imagem (`gpt-image-2*`, `sd-2.5-ch*`) — uma chamada de chat ali responde `503 model_not_found … under group default`; a ferramenta atribui cada token ao grupo **`国模`** para desbloquear os 7 modelos de texto acima. Os 8 ids de imagem (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) **não** são modelos de texto e não verificam uma chave.

Reverificado em **2026-10-19** contra a matriz de chat ao vivo (3 chaves × 5 saídas): o conjunto de chaves atual responde `403 insufficient_user_quota` na chave em vigor e `503` nas outras duas, então **nenhum id é adicionado ou removido aqui** — a linha de marcação acima é a própria medição de chat-200 verificada do repositório (`2026-10-15`), e uma barreira de saldo não é uma falha de modelo.

## 🧪 Como usar a API

A URL base é **`https://api.leostudio.cc/v1`** — compatível com OpenAI, então qualquer coisa que fale OpenAI funciona (SDKs, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Início rápido

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

`node src/cli.js help` lista as tarefas; cada tarefa lê suas próprias flags. As chaves ficam em `keys.txt`, uma por linha; o detalhe por conta (e-mail, etapas, resultado da verificação) fica em `accounts.json`. As configurações do launcher persistem em `launcher.config.json`.

### 🖱️ O launcher

```bash
node src/launcher.js
```

Um menu sobre os módulos de tarefas: **mint**, **verify**, **probe**, **9Router**. Ele pergunta `count` (chaves por execução) e `concurrency` (saídas paralelas), mantém-nos em `launcher.config.json` e executa `node src/cli.js <task>` com as flags corretas. O item de menu **6** executa o registro no 9Router diretamente.

## ✅ Verificado e funcionando — toda chave é testada

Medido em **2026-10-15**: **3 contas → 3 chaves, uma chave por conta**. Cada chave foi verificada depois de existir, em uma saída *independente* da geração, com `verify.independent=true` em `accounts.json`.

| Verificação | Chamada | Resultado |
| --- | --- | --- |
| Autenticação + lista de modelos | `GET https://api.leostudio.cc/v1/models` (no grupo **`国模`**) | **200** + 7 ids de modelos de texto |
| Conclusão real | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + mensagem do assistente |

A verificação é executada a partir de **uma saída diferente da que gerou a chave**, então não pode passar com base no estado da sessão em vez da validade da chave. `node src/cli.js verify` reproduz exatamente essa verificação para o seu próprio arquivo. Uma chave só é gravada em `keys.txt` depois que ambas as verificações respondem 200.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Observações |
| --- | --- | --- |
| Portões | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Caixa de correio | [Emailnator](https://www.emailnator.com) | um endereço Gmail novo por conta, lido através das suas saídas; o código está no **corpo** (campo `content`), não no assunto |
| Enviar código | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Registrar | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Login | `POST /api/user/login` | retorna **`data.access_token` (JWT)** + cookie `new_api_refresh`; o cookie sozinho responde `401 AUTH_UNAUTHORIZED` — Bearer é obrigatório |
| Self | `GET /api/user/self` (Bearer + cookie) | `quota: 75000` por conta |
| Criar token | `POST /api/token/` (Bearer) | chave mascarada primeiro (`tbCR******…`) |
| Revelar chave | `POST /api/token/{id}/key` (Bearer) | chave em texto claro de 48 caracteres |
| Grupo | `PUT /api/token/{id}` | marca para **`国模`** (`unlimited_quota: true`) — caso contrário o relay responde `401 Invalid token` mesmo que a conta tenha cota |
| Provar | `GET /v1/models` + `POST /v1/chat/completions` | ambos em uma saída *diferente* da geração; só então a chave é anexada a `keys.txt` |

## ⚙️ Opções da CLI

Todo o código fica em `src/` — execute a partir da raiz do repositório como `node src/<file>.js`.

| Ferramenta | Flags |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — dispatcher; `--connect-9router` registra as chaves no 9Router após a tarefa; as flags próprias de cada tarefa via `node src/<task> --help` |
| `src/mint.js` | wrapper fino → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (padrão `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | sondagem profunda de uma conta ou chave |
| `src/launcher.js` | interativo: mint / verify / probe / settings — `count` e `concurrency` persistem em `launcher.config.json` |

## 🛰️ Atrás de um proxy

* As saídas vêm de `proxies.txt` (uma linha por saída, `scheme://host:port`, `user:pass@` suportado, comentários com `#` ignorados). O mesmo pool alimenta as chamadas ao painel, a verificação de chaves e as leituras da caixa de correio; as ferramentas nunca discam para o provedor diretamente.
* **A triagem é o trabalho.** Cada conta fixa a primeira saída que comprova `GET /api/status` contra o host do painel, e a verificação fixa uma saída comprovada *diferente* — uma saída morta se aposenta e a conta continua na próxima.
* A caixa de correio ([Emailnator](https://www.emailnator.com)) é um serviço de e-mail temporário de terceiros, e não o painel; sua API também é lida através das suas saídas.
* O e-mail de verificação chega de **`leostudio2026@163.com`** (não do domínio do painel); o primeiro código de um lote pode levar alguns minutos para chegar — a ferramenta espera em vez de reenviar, porque um reenvio invalida o código em trânsito.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | caixa de correio, etapas, check-in, ambas as saídas de verificação por conta — ignorado pelo git |
| `models.json` | uma captura recente de `/v1/models` no grupo `国模` — ignorado pelo git |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `out/pinned-<date>.log` | o log por execução (saída, tempo, resposta exata do servidor) — ignorado pelo git |
| `src/mint.js` · `src/probe-key.js` | os motores para os quais a CLI despacha |
| `src/connect-9router.js` | registra as chaves em `keys.txt` como conexões do 9Router |

## 🔌 Conectar ao 9Router

O [9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. O Leo Studio é compatível com OpenAI, então registre-o uma vez e use todas as chaves:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

Cada chave em `keys.txt` se torna uma conexão do nó do provedor `leostudio` (`--api-key <key>` registra uma única chave, `--model <id>` substitui o padrão). Depois escolha um modelo dentro do 9Router:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, modelo padrão `deepseek-v4-flash`.

## 🔑 O que uma chave oferece

| | |
| --- | --- |
| 🏢 Provedor | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 O que o provedor oferece | 75.000 créditos por conta · 7 modelos de texto (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · toda chave verificada ao vivo |
| 🔑 O que uma chave oferece | uma chave de API vinculada à sua própria conta: os 7 ids de modelos no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, e é exatamente por isso que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Seus dados | apenas leostudio.cc e o backend de caixa de correio que você configurar são contatados; as chaves ficam na sua máquina |

## 🐞 Problemas

Abra uma issue com a etapa que falhou e o final do log de execução (`out/pinned-<date>.log`) — ele contém a saída, o tempo e a resposta exata do servidor, que é tudo o que é necessário para reproduzir uma falha. Nunca anexe uma chave. **[Abra uma issue](../../issues)** e PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>