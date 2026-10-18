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

**Otomatik oluşturulan API anahtarlarıyla toplu Leo Studio hesabı oluşturun — OpenAI uyumlu çıkarım (DeepSeek, GLM, Kimi, Hunyuan) + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-7%20served-412991?style=for-the-badge)](https://api.leostudio.cc)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-7-of-them) · [🧪 API'yi kullanma](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>


---

## ✨ Bu neden var

Leo Studio (`api.leostudio.cc`) her hesaba **75.000 kredi** verir ve kullanılabilir birim *hesap başına bir anahtar*dır — kota **hesapta** yaşar, aynı hesabın ikinci bir anahtarında asla. Kayıt açıktır, **captcha yoktur** (`turnstile_check: false`) ve e-posta ile doğrulanır; **günlük giriş yoktur** (`签到功能未启用`). Bu araç, tüm süreci sizin proxy listeniz üzerinden gözetimsiz olarak yürütür ve bir anahtarı yalnızca **`国模`** grubunda gerçek bir tamamlama yapıldıktan sonra kaydeder.

## 🎁 Ücretsiz katman — ne kadar alırsınız

**Her yeni Leo Studio hesabı 75.000 kredi taşır — tek seferlik, yenileme yok, kart yok.**

| Öğe | Ölçülen |
| --- | --- |
| Kayıt hibesi | **75.000 kredi** (`GET /api/user/self` → `quota: 75000`) |
| Günlük giriş | **devre dışı** (`{"success":false,"message":"签到功能未启用"}`) — hibe tek seferliktir |
| Kayıtta captcha | **yok** (`turnstile_check: false`) |
| Panelin kabul ettiği e-posta | **Gmail** (veya QQ) — tek kullanımlık alan adları reddedilir; doğrulama postası `leostudio2026@163.com` adresinden gelir (konu «Leo Studio邮箱验证邮件», 6 karakterlik kod, 10 dakika geçerlilik) |
| Metin modellerini sunan grup | **`国模`** — yeni bir hesabın `default` grubu yalnızca görsel hattını sunar ve oradaki bir sohbet çağrısı `503 model_not_found` yanıtı verir |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir (kota hesap başınadır) |

> 💡 Ücretsiz katman Leo Studio tarafından belirlenir ve değişebilir. Güncel sayıları [leostudio.cc](https://leostudio.cc) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js verify                 # every key in keys.txt is re-tested against the live API
```

## 🤖 Modeller — 7'sinin tamamı

**`国模`** grubunda üretilmiş bir anahtarla `GET https://api.leostudio.cc/v1/models` **7 metin modeli** sunar ([`models.json`](models.json) içinde yakalanmıştır):

| Model | ✓ |
| --- | --- |
| `deepseek-v4-flash` | ✓ |

Yeni bir hesabın `default` grubu görsel hattını (`gpt-image-2*`, `sd-2.5-ch*`) sunar — oradaki bir sohbet çağrısı `503 model_not_found … under group default` yanıtı verir; araç, yukarıdaki 7 metin modelinin kilidini açmak için her token'ı **`国模`** grubuna atar. 8 görsel kimliği (`gpt-image-2`, `gpt-image-2.5*`, `sd-2.0-ch1`, `sd-2.5-ch*`) metin modeli **değildir** ve bir anahtarı doğrulamaz.

## 🧪 API'yi nasıl kullanırım

Temel URL **`https://api.leostudio.cc/v1`**'dir — OpenAI uyumludur, yani OpenAI konuşan her şey çalışır (SDK'lar, Cursor, OpenCode, Kilo Code, …).

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

`node src/cli.js help` görevleri listeler; her görev kendi bayraklarını okur. Anahtarlar `keys.txt` dosyasına her satırda bir tane olacak şekilde düşer; hesap başına ayrıntı (e-posta, adımlar, doğrulama sonucu) `accounts.json` dosyasına düşer. Başlatıcıdan gelen ayarlar `launcher.config.json` dosyasında kalıcıdır.

### 🖱️ Başlatıcı

```bash
node src/launcher.js
```

Görev modülleri üzerinde bir menü: **mint**, **verify**, **probe**, **9Router**. `count` (çalıştırma başına anahtar) ve `concurrency` (paralel çıkışlar) değerlerini sorar, bunları `launcher.config.json` dosyasında tutar ve doğru bayraklarla `node src/cli.js <task>` komutunu başlatır. Menü öğesi **6** doğrudan 9Router kaydını çalıştırır.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

Ölçüm **2026-10-15**: **3 hesap → 3 anahtar, hesap başına bir anahtar**. Her anahtar var olduktan sonra, üretimden *bağımsız* bir çıkıştan, `accounts.json` içinde `verify.independent=true` ile kontrol edildi.

| Kontrol | Çağrı | Sonuç |
| --- | --- | --- |
| Kimlik doğrulama + model listesi | `GET https://api.leostudio.cc/v1/models` (**`国模`** grubunda) | **200** + 7 metin modeli kimliği |
| Gerçek tamamlama | `POST https://api.leostudio.cc/v1/chat/completions` (`deepseek-v4-flash`) | **200** + asistan mesajı |

Kontrol, **anahtarı üreten çıkıştan farklı bir çıkıştan** çalışır, böylece anahtar geçerliliği yerine oturum durumuyla geçemez. `node src/cli.js verify` kendi dosyanız için tam olarak bu kontrolü yeniden üretir. Bir anahtar `keys.txt` dosyasına yalnızca her iki kontrol de 200 yanıtı verdikten sonra yazılır.

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
| Posta kutusu | [Emailnator](https://www.emailnator.com) | hesap başına yeni bir Gmail adresi, çıkışlarınız üzerinden okunur; kod **gövdededir** (`content` alanı), konuda değil |
| Kod gönder | `GET /api/verification?email=<plain>` | `{"success":true}` |
| Kayıt | `POST /api/user/register` (`username`, `password`, `email`, `verification_code`) | `{"success":true}` |
| Giriş | `POST /api/user/login` | **`data.access_token` (JWT)** + `new_api_refresh` çerezi döndürür; yalnızca çerez `401 AUTH_UNAUTHORIZED` yanıtı verir — Bearer gereklidir |
| Self | `GET /api/user/self` (Bearer + cookie) | hesap başına `quota: 75000` |
| Token oluştur | `POST /api/token/` (Bearer) | önce maskelenmiş anahtar (`tbCR******…`) |
| Anahtar açığa çıkar | `POST /api/token/{id}/key` (Bearer) | 48 karakterlik düz metin anahtar |
| Grup | `PUT /api/token/{id}` | **`国模`** olarak damgala (`unlimited_quota: true`) — aksi halde hesap kota tutmasına rağmen aktarıcı `401 Invalid token` yanıtı verir |
| Kanıtla | `GET /v1/models` + `POST /v1/chat/completions` | her ikisi de üretimden *farklı* bir çıkışta; ancak o zaman anahtar `keys.txt` dosyasına eklenir |

## ⚙️ CLI seçenekleri

Tüm kod `src/` içinde yaşar — depo kökünden `node src/<file>.js` olarak çalıştırın.

| Araç | Bayraklar |
| --- | --- |
| `src/cli.js` | `mint` · `verify` · `probe` — dağıtıcı; `--connect-9router` görevden sonra anahtarları 9Router'a kaydeder; her görevin kendi bayrakları `node src/<task> --help` ile |
| `src/mint.js` | ince sarmalayıcı → `provider-cli.js` / `mint-newapi-pinned.js` — `--count N` (3) · `--pool FILE` · `--mail emailnator\|imap` · `--sender REGEX` (varsayılan `leostudio2026@163`) · `--scan` / `--scan-conc` · `--poll-ms` · `--code-wait` · `--max-cycle` · `--budget` |
| `src/probe-key.js` | tek bir hesabın veya anahtarın derin incelenmesi |
| `src/launcher.js` | etkileşimli: mint / verify / probe / settings — `count` ve `concurrency` `launcher.config.json` dosyasında kalıcıdır |

## 🛰️ Proxy arkasında

* Çıkışlar `proxies.txt` dosyasından gelir (her satırda bir çıkış, `scheme://host:port`, `user:pass@` desteklenir, `#` yorumları yok sayılır). Aynı havuz panel çağrılarını, anahtar doğrulamasını ve posta kutusu okumalarını besler; araçlar sağlayıcıyı asla doğrudan aramaz.
* **Eleme iştir.** Her hesap, panel ana bilgisayarına karşı `GET /api/status` kanıtlayan ilk çıkışı sabitler ve doğrulama *farklı* bir kanıtlanmış çıkışı sabitler — ölü bir çıkış kendini emekliye ayırır ve hesap bir sonrakinde devam eder.
* Posta kutusu ([Emailnator](https://www.emailnator.com)) panel yerine üçüncü taraf bir geçici posta hizmetidir; API'si de çıkışlarınız üzerinden okunur.
* Doğrulama postası **`leostudio2026@163.com`** adresinden gelir (panel alan adından değil); bir partinin ilk kodu gelmesi birkaç dakika sürebilir — araç yeniden göndermek yerine bekler, çünkü yeniden gönderme uçuştaki kodu geçersiz kılar.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | her satırda canlı doğrulanmış bir anahtar — git tarafından yok sayılır |
| `accounts.json` | posta kutusu, adımlar, giriş, hesap başına her iki doğrulama çıkışı — git tarafından yok sayılır |
| `models.json` | `国模` grubunda yeni bir `/v1/models` yakalaması — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız, her satırda bir tane — git tarafından yok sayılır |
| `out/pinned-<date>.log` | çalıştırma başına günlük (çıkış, zamanlama, sunucunun tam yanıtı) — git tarafından yok sayılır |
| `src/mint.js` · `src/probe-key.js` | CLI'nin dağıttığı motorlar |
| `src/connect-9router.js` | `keys.txt` içindeki anahtarları 9Router bağlantıları olarak kaydeder |

## 🔌 9Router'a bağlan

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Leo Studio OpenAI uyumludur, bu yüzden bir kez kaydedin ve her anahtarı kullanın:

```bash
node src/connect-9router.js --base http://localhost:20128 --password 123456
# or: node src/cli.js mint --count 3 --connect-9router
```

`keys.txt` içindeki her anahtar `leostudio` sağlayıcı düğümünün bir bağlantısı olur (`--api-key <key>` bunun yerine tek bir anahtar kaydeder, `--model <id>` varsayılanı geçersiz kılar). Ardından 9Router içinde bir model seçin:

```
leostudio/deepseek-v4-flash
leostudio/deepseek-v4.1-flash
leostudio/glm-5.3-flash
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--prefix leostudio`, `--base-url https://api.leostudio.cc/v1`, varsayılan model `deepseek-v4-flash`.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **Leo Studio** — [leostudio.cc](https://leostudio.cc) |
| 🎁 Sağlayıcının verdikleri | hesap başına 75.000 kredi · 7 metin modeli (deepseek-v4-flash, kimi-k3, glm-5.3-flash) · her anahtar canlı doğrulanmış |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktada 7 model kimliği, planınızın sınırlarında. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam olarak budur |
| 🌐 API şekli | OpenAI uyumlu: `POST https://api.leostudio.cc/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca leostudio.cc ve yapılandırdığınız posta kutusu arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

Başarısız adım ve çalıştırma günlüğünün sonu (`out/pinned-<date>.log`) ile bir sorun açın — günlük çıkışı, zamanlamayı ve sunucunun tam yanıtını taşır, bu da bir hatayı yeniden üretmek için gereken her şeydir. Asla bir anahtar eklemeyin. **[Bir sorun açın](../../issues)** ve PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 leostudio-bulk-apikey katkıda bulunanlar

</div>