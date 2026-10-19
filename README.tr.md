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

**Leo Studio hesaplarını otomatik oluşturulmuş API anahtarlarıyla toplu oluşturun — OpenAI‑uyumlu çıkarım (DeepSeek, GLM, Kimi, Hunyuan) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-7-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulanmış](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router'a bağlan](#-connect-to-9router) · [⚙️ CLI seçenekleri](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Neden bu var

Leo Studio (`api.leostudio.cc`) her hesaba **75.000 kredi** verir ve kullanılabilir birim *anahtar başına bir hesap*dır — kota **hesap** üzerinde yaşar, aynı hesabın ikinci bir anahtarında **asla**. Kayıt açık, **captcha yok** (`turnstile_check: false`) ve e‑posta ile doğrulanır; **günlük giriş yok** (`签到功能未启用`). Bu araç, proxy listeniz üzerinden tüm süreci denetimsiz yürütür ve yalnızca **`国模`** grubunda gerçek bir tamamlama gerçekleştiğinde anahtarı kaydeder.

## 🎁 Ücretsiz katman — ne kadar alırsınız

**Her yeni Leo Studio hesabı 75.000 kredi taşır — tek seferlik, doldurulamaz, kart gerekmez.**

| Öğe | Ölçülen |
| --- | --- |
| Kayıt hediyesi | **75.000 kredi** (`GET /api/user/self` → `quota: 75000`) |
| Günlük giriş | **devre dışı** (`{"success":false,"message":"签到功能未启用"}`) — hibe tek seferlik |
| Kayıt sırasında Captcha | **yok** (`turnstile_check: false`) |
| Panelin kabul ettiği e-posta | **Gmail** (veya QQ) — geçici alan adları reddedilir; doğrulama e-postası `leostudio2026@163.com` adresinden gelir (konu «Leo Studio邮箱验证邮件», 6 karakterli kod, 10 dakikalık geçerlilik) |
| Metin modellerini sunan grup | **`国模`** — yeni bir hesabın `default` grubu yalnızca görüntü satırını sunar ve orada yapılan sohbet çağrısı `503 model_not_found` yanıtını verir |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir (kota hesap başına) |

> 💡 Ücretsiz katman Leo Studio tarafından belirlenir ve değişebilir. Canlı sayıları [leostudio.cc](https://leostudio.cc) adresinde kontrol edin — ve aracın kendi kapısı karar versin:

```bash
node src/cli.js verify                 # keys.txt içindeki her anahtar canlı API’ye karşı yeniden test edilir
```

## 🤖 Modeller — hepsi 7

`GET https://api.leostudio.cc/v1/models` **`国模`** grubunda oluşturulmuş bir anahtarla **7 metin modeli** sunar ([`models.json`](models.json) içinde yakalanmıştır):

| Model | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

Yeni bir hesabın `default` grubu sadece görüntü satırını (`gpt-image-2*`, `sd-2.5-ch*`) sunar — orada yapılan sohbet çağrısı `503 model_not_found … under group default` yanıtını verir; araç her token’ı **`国模`** grubuna atayarak yukarıdaki 7 metin modelinin kilidini açar. 8 görüntü kimliği (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) **metin modeli değildir** ve bir anahtarı doğrulamaz.

**2026-10-19** tarihinde canlı sohbet matrisine karşı yeniden kontrol edildi (3 anahtar × 5 çıkış): mevcut anahtar seti sabit anahtar için `403 insufficient_user_quota`, diğer ikisi için `503` yanıtı veriyor, bu yüzden **burada hiçbir kimlik eklenip çıkarılmadı** — yukarıdaki tik satırı deponun kendi doğrulanmış chat‑200 ölçümüdür (`2026-10-15`), ve bir bakiye duvarı model hatası değildir.

## 🧪 API'yi nasıl kullanılır

Temel URL **`https://api.leostudio.cc/v1`** — OpenAI‑uyumlu, yani OpenAI konuşabilen her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

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

## 🛠 Hızlı başlangıç

```bash
# bu depoyu klonlayın (veya ZIP'i indirin), ardından:
cd leostudio-bulk-apikey

# 1) proxy listeniz, satır başına bir çıkış (http://, socks5://, socks4:// veya sadece host:port)
printf 'socks5://127.0.0.1:1080\n' > proxies.txt

# 2) çalıştır — bir çalıştırma yeni bir hesap için bir anahtar üretir
node src/launcher.js             # etkileşimli menü: mint / verify / probe / settings
# ya da doğrudan çalıştırın:
node src/cli.js mint --count 3   # yeni hesaplar → her biri doğrulanmış bir anahtar
node src/cli.js verify           # diskte zaten bulunan anahtarları yeniden kontrol edin
node src/cli.js probe            # tek bir hesap ya da anahtarın derin incelemesi
```

`node src/cli.js help` görevleri listeler; her görev kendi bayraklarını okur. Anahtarlar `keys.txt` dosyasına, satır başına bir anahtar olarak yazılır; hesap detayları (e‑posta, adımlar, doğrulama sonucu) `accounts.json` dosyasına kaydedilir. Başlatıcı ayarları `launcher.config.json` içinde kalıcıdır.

### 🖱️ Başlatıcı

```bash
node src/launcher.js
```

Görev modüllerine bir menü: **mint**, **verify**, **probe**, **9Router**. `count` (çalıştırma başına anahtar sayısı) ve `concurrency` (paralel çıkışlar) sorulur, `launcher.config.json` içinde saklanır ve `node src/cli.js <task>` doğru bayraklarla başlatılır. Menü öğesi **6**, 9Router kaydını doğrudan çalıştırır.

## ✅ Doğrulanmış çalışma — her anahtar test edildi

Ölçülen **2026-10-15**: **3 hesap → 3 anahtar, hesap başına bir anahtar**. Her anahtar, var olduktan sonra, mint işleminden *bağımsız* bir çıkışta `verify.independent=true` ile `accounts.json` içinde kontrol edildi.

| Kontrol | Çağrı | Sonuç |
| --- | --- | --- |
| Kimlik doğrulama + model listesi | `GET https://api.leostudio.cc/v1/models` ( **`国模`** grubunda) | **200** + 7 metin model kimliği |
| Gerçek tamamlama | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + asistan mesajı |

Kontrol, anahtarı oluşturan çıkıştan **farklı bir çıkış** üzerinden çalıştırılır, böylece oturum durumu değil anahtar geçerliliği test edilir. `node src/cli.js verify` bu kontrolü kendi dosyanız için tam olarak yeniden üretir. Bir anahtar yalnızca her iki kontrol de 200 döndürdüğünde `keys.txt` dosyasına yazılır.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: Leo Studio page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.leostudio.cc/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| Kapılar | `GET /api/status` | `register_enabled: true` · `email_verification: true` · `turnstile_check: false` · `checkin_enabled: false` |
| Posta kutusu | [Emailnator](https://www.emailnator.com) | hesap başına yeni bir Gmail adresi, çıkışlarınız üzerinden okunur; kod **gövde** içinde (`content` alanı) bulunur, konu başlığında değil |
| Kod gönder | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Kayıt | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Giriş | `POST /api/user/login` | **`data.access_token` (JWT)** + `new_api_refresh` çerezi döner; çerez tek başına `401 AUTH_UNAUTHORIZED` yanıtı verir — Bearer zorunludur |
| Kendisi | `GET /api/user/self` (Bearer + çerez) | hesap başına `quota: 75000` |
| Token oluştur | `POST /api/token/` (Bearer) | maskelenmiş anahtar önce (`tbCR******…`) |
| Anahtar göster | `POST /api/token/{id}/key` (Bearer) | 48 karakterlik düz metin anahtar |
| Grup | `PUT /api/token/{id}` | **`国模`** (`unlimited_quota: true`) olarak işaretlenir — aksi takdirde relay `401 Invalid token` yanıtı verir, hesabın kotası olsa bile |
| Kanıt | `GET /v1/models` + `POST /v1/chat/completions` | ikisi de mint işleminden *farklı* bir çıkışta yapılır; sadece bu aşamada anahtar `keys.txt` dosyasına eklenir |

## ⚙️ CLI seçenekleri

Tüm kod `src/` içinde bulunur — depoyu kök dizininden `node src/<file>.js` şeklinde çalıştırın.

| Araç | Bayraklar |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — dağıtıcı; `--connect-9router` görev sonrası anahtarları 9Router’a kaydeder; her görevin kendi bayrakları `node src/<task> --help` ile görüntülenir |
| `src/mint.js` | ince sarmalayıcı → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (varsayılan `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | tek bir hesap ya da anahtarın derin incelemesi |
| `src/launcher.js` | etkileşimli: mint / verify / probe / settings — `count` ve `concurrency` `launcher.config.json` içinde kalıcıdır |

## 🛰️ Proxy'ler arkasında

* Çıkışlar `proxies.txt` dosyasından gelir (satır başına bir çıkış, `scheme://host:port`, `user:pass@` desteklenir, `#` yorumları yok sayılır). Aynı havuz panel çağrılarını, anahtar doğrulamasını ve posta kutusu okumalarını besler; araçlar sağlayıcıya doğrudan bağlanmaz.
* **Tarama işin kendisidir.** Her hesap, panel hostuna karşı `GET /api/status` yanıtı veren ilk çıkışı sabitler ve doğrulama, *farklı* bir kanıtlanmış çıkışı sabitler — ölü bir çıkış kendini devre dışı bırakır ve hesap bir sonraki çıkışa geçer.
* Posta kutusu ([Emailnator](https://www.emailnator.com)) panel yerine üçüncü taraf bir geçici‑mail hizmetidir; API’si de çıkışlarınız üzerinden okunur.
* Doğrulama e‑postası **`leostudio2026@163.com`** adresinden gelir (panel domaini değil); bir partinin ilk kodu gelmesi birkaç dakika sürebilir — araç yeniden göndermek yerine bekler, çünkü yeniden gönderim uçta olan kodu geçersiz kılar.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | her satırda bir canlı‑doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | posta kutusu, adımlar, check‑in, her hesap için iki doğrulama çıkışı — git tarafından yok sayılır |
| `models.json` | `国模` grubunda yeni bir `/v1/models` yakalaması — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız, satır başına bir — git tarafından yok sayılır |
| `out/pinned-<date>.log` | her çalıştırma günlüğü (çıkış, zamanlama, tam sunucu yanıtı) — git tarafından yok sayılır |
| `src/mint.js` · `src/probe-key.js` | CLI'nin yönlendirdiği motorlar |
| `src/connect-9router.js` | anahtarları `keys.txt` içinde 9Router bağlantıları olarak kaydeder |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI‑uyumlu bir yönlendiricidir. Leo Studio OpenAI‑uyumlu olduğundan, bir kez kaydedin ve her anahtarı kullanın:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# ya da: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` içindeki her anahtar, `leostudio` sağlayıcı düğümünün bir bağlantısı olur (`--api-key <key>` tek bir anahtarı kaydeder, `--model <id>` varsayılanı geçersiz kılar). Ardından 9Router içinde bir model seçin:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, varsayılan model `deepseek-v4-flash`.

## 🔑 Bir anahtar size ne sağlar

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Sağlayıcının verdiği | hesap başına 75.000 kredi · 7 metin modeli (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · her anahtar canlı‑doğrulanmış |
| 🔑 Bir anahtarın size sunduğu | kendi hesabına özgü bir API anahtarı: aşağıdaki uç noktada 7 model kimliği, plan limitleriniz dahilinde. Kota **hesap** üzerinde yaşar, bu yüzden araç her anahtar için bir hesap oluşturur |
| 🌐 API şekli | OpenAI‑uyumlu: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca leostudio.cc ve yapılandırdığınız posta kutusu arka ucu ile iletişim kurulur; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Başarısız adımı ve çalıştırma günlüğünün son kısmını (`out/pinned-<date>.log`) içeren bir sorun açın — bu dosya çıkışı, zamanlamayı ve tam sunucu yanıtını taşır, bir hatayı yeniden üretmek için gereken her şey burada. Asla bir anahtar eklemeyin. **[Bir sorun açın](../../issues)** ve PR'ler memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey contributors

</div>