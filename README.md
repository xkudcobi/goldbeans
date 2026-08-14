# GoldBeans — kafe sitesi

İllüstrasyonlu, etkileşimli bir kafe sitesi. React + Vite.

**Canlı:** <https://xkudcobi.github.io/goldbeans/>

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # dist/ klasörüne production çıktısı
```

## Yayın

`main`'e her push'ta GitHub Actions build alıp Pages'e atıyor
(`.github/workflows/deploy.yml`). Site kökte değil `/goldbeans/` altında
durduğu için iş akışı `BASE_PATH`'i veriyor; `vite.config.js` onu okuyor,
çizimlerin içindeki `__BASE__` yer tutucusu da `Stage.jsx`'te bu değerle
doluyor. Deploy sonrası tarayıcı eski sürümü önbellekten gösterebiliyor —
kontrol ederken sert yenile.

### Kendi alan adına geçmek

1. Alan adı sağlayıcında DNS kaydı aç (GitHub Pages için `A` kayıtları
   `185.199.108–111.153`, `www` için `CNAME` → `xkudcobi.github.io`).
2. Repoya `public/CNAME` ekle, içinde **tek satır** alan adı olsun:
   `goldbeanscoffeehouse.com`. Başka bir şey yazma.
3. GitHub → Settings → Pages → Custom domain'e aynı adı gir, DNS kontrolü
   yeşile dönünce **Enforce HTTPS**'i işaretle.

Taban yolu kendiliğinden ayarlanıyor: iş akışı `public/CNAME` görürse
tabanı `/` yapıyor, görmezse `/goldbeans/`. Bu yüzden 2. adımı atlarsan
site tüm CSS/JS'ini yanlış yoldan arayıp bomboş açılır.

### Güvenlik

Yayına giden sayfa bir **CSP** taşıyor: sadece kendi alan adından script
ve stil yükleyebiliyor, dışarıya istek atamıyor, iframe'e gömülemiyor.
Politika iki yerde duruyor ve **ikisi aynı kalmalı**:

| Yer | Ne zaman geçerli |
|---|---|
| `vite.config.js` (`CSP`) | build sırasında `<meta>` olarak basılıyor — her yerde çalışır, GitHub Pages dahil |
| `public/_headers` | Netlify / Cloudflare Pages gerçek HTTP başlığı olarak veriyor; `frame-ancestors` ve HSTS sadece burada olabiliyor |

GitHub Pages özel başlık desteklemiyor, `_headers`'ı yok sayıyor. Tam
başlık seti istiyorsan alan adını Cloudflare'e (ücretsiz plan yeter)
bağlayıp Rules → Transform Rules → Modify Response Header ile aynılarını
ekle.

CSP `index.html`'e elle yazılmıyor, çünkü `script-src 'self'` geliştirme
sunucusunu kırıyor (React Fast Refresh satır içi script basıyor). Eklenti
`apply: 'build'` ile sadece üretim çıktısına ekliyor.

**Yeni bir dış kaynak eklersen** (harita gömme, analitik, yeni font)
sayfa sessizce onu yüklemez. Tarayıcı konsolunda `Refused to load…`
yazar; ilgili direktifi HER İKİ dosyada da genişletmen gerekir.

**Açık kalan iki konu:**

- `public/music/` altındaki dört parça telifli (Daft Punk, Eagles, James
  Hype, Superlover). Kendi alan adından yayınlamak, `github.io` altında
  durmasından farklı bir görünürlük demek. Lisanssız müzikle telif
  bildirimi gelebilir — telifsiz parçalarla değiştirmek en temizi.
- Yazı tipi Google Fonts'tan geliyor, yani her ziyaretçinin IP'si
  Google'a gidiyor (KVKK/GDPR tarafında tartışmalı). Kendi sunucundan
  servis etmek için: `.woff2` dosyasını indirip `public/fonts/` içine at,
  `tokens.css`'teki `@import` satırını `@font-face` ile değiştir, sonra
  CSP'deki `fonts.googleapis.com` / `fonts.gstatic.com` izinlerini kaldır.

## Kendine uyarlamak

**Tek dosya:** `src/config/cafe.js`. Kafe adı, tagline, imza içecekler, tüm menü,
çalışma saatleri, adres ve iletişim orada. Bileşenlere dokunman gerekmiyor.

```js
export const cafe = {
  name: 'GoldBeans',             // logo (harf sayısı otomatik ayarlanır)
  tagline: '(köşedeki kahveci)',
  signatures: [ /* raftaki 4 fincan */ ],
  menu: [ /* gruplar ve ürünler */ ],
  hours: [ ... ], address: { ... }, contact: { ... },
}
```

**Çizimler:** Sahnelerdeki öğelerin hiçbiri elle yazılmadı — hepsi
<https://alt-portfolio.framer.website/> adresindeki siteden çıkarıldı; tezgah
`src/art/framerScene.js`, oda `src/art/framerRoom.js` içinde. İkisi de
üretilmiş dosya, elle düzenleme; nasıl yeniden üretileceği
`docs/asset-extraction.md` içinde.

> **Not:** İllüstrasyonlar bu projeye ait değil, o siteden alındı. Kişisel
> deneme/paylaşım dışında (ticari kullanım, kendi işin olarak sunmak vb.)
> kullanmadan önce hak sahibinden izin almak gerekir.

## Sayfa yapısı

1. **Açılış perdesi** — maroon zemin, harf harf yazılan "(selam)",
   "(yükleniyor...)" satırları (~4sn). Satırlar `cafe.js → loadingLines`,
   hız `Preloader.jsx` içindeki üç sabit.
2. **Tezgah sahnesi** — açılıştaki ilk manzara. Tam ekran: üstte biraz boşluk,
   tezgahın tabanı ekranın dibinde. Tuval yüksekliğe göre ölçekleniyor
   (`Stage.jsx`, `fit="height"`); genişlik üst sınır.
3. **Menü** — gruplu fiyat listesi
4. **Kapı odası** — kapı şubelere götürüyor
5. **Şubeler** — kapının çıktığı ekran (tasarımı henüz konuşulmadı)
6. **Ziyaret** — saatler, adres, iletişim
7. **Alt bilgi**

### Çıkarılan ama silinmeyen iki parça

Geri istenirse hazır duruyorlar — bileşen de CSS de yerinde:

| Parça | Neydi | Geri almak için |
|---|---|---|
| `components/CloudIntro.jsx` | Üstteki bulutlu boşluk, scroll'la beliren satırlar | `App.jsx`'te `<CounterScene/>`'den önce `<CloudIntro/>` |
| `components/SceneCarousel.jsx` + `ControlBar.jsx` | Sağa/sola sahne geçişi | `<CounterScene/><RoomScene/>` yerine `<SceneCarousel/>` |

## Etkileşimler

Hover'da çizimin kendisi orijinalin hover haliyle değişiyor — efekt elle
yazılmadı, iki hal de siteden çıkarıldı.

| Öğe | Hover |
|---|---|
| **Fincan 1-4** | Pembeye dönüyor + içecek adı/notu/fiyatı beliriyor. Tıklayınca menüye gider. |
| **Demlik (fincan 5)** | Kahverengiye dönüyor |
| **Kahve makinesi** | Kahverengiye dönüyor (orijinaldeki GIF `public/art/machine-hover.gif`) |
| **Lamba** | İp pembeye dönüyor, "SUNSET MOOD" balonu |
| **Radyo**, **Bitki** | Kahverengiye dönüyor + balon |
| **Saat**, **Makine** | Konuşma balonu çıkıyor |

Balonların yazıları `cafe.js → tips`. Balonun kendisi çizimin parçası,
satır sayısı sabit — metni değiştirebilirsin, satır ekleyemezsin.

Hover geçişleri kasıtlı olarak **anlık** (transition yok) — yumuşatma eklersen
illüstrasyonun karakteri kaybolur.

**Telefonda hover yok, o yüzden kural şu:** linklerde (fincanlar, makine,
bitki, telefon, kalemlik) **ilk dokunuş balonu/etiketi açıyor, ikinci
dokunuş gidiyor**. Düğmelerde (lamba, radyo) bekleme yok, tek dokunuş
çalışıyor — orada balonun anlatacağı bir şey yok, sonucu zaten görüyorsun.
Kod: `hooks/useHover.js` (`guard`) ve `components/InteractiveProp.jsx`.

### Tıklamalar

| Öğe | Ne oluyor |
|---|---|
| **Lamba** | **Sunset modu** açılıp kapanıyor: zemin `#e5dece`'ye dönüyor, lambadan ışık hüzmesi düşüyor, soldan pencere ışığı vuruyor. Durum `body.is-sunset` — menü, ziyaret, footer da moda giriyor. |
| **Radyo** | Müziği açıp kapatıyor ve alttaki **çalar adasını** çıkarıyor (aşağı bak). Parça listesi `cafe.js → music.tracks`, **karışık** çalıyor. Sağ üstteki ses düğmesi kaldırıldı (bkz. `FixedUI.jsx`) — yerini çalar adası aldı. |
| **Saat** | Çalışma saatlerini gösteren küçük bir pencere açıyor (`components/HoursCard.jsx`). Çarpı, dışına tıklama veya Esc kapatıyor. Eskiden sayfanın en altındaki Ziyaret bölümüne atıyordu. |
| **Fincan 1-4** | Menüye gider |
| **Kapı** (oda sahnesi) | Şubeler ekranına götürüyor. Açılıp kapanma zaten **hover'da** oluyor (çizimin iki hâli de orijinalden); tıklamaya ayrı animasyon eklenmedi. |
| **Telefon** (oda sahnesi) | `tel:` ile aramaya götürüyor; hover'da numara beliriyor. Numara `cafe.js → contact.phone` |
| **Kalemlik** (oda sahnesi) | Öneri/şikayet formunu yeni sekmede açıyor; hover balonu "ÖNERİLERİNİ DUYALIM" diyor. Adres `cafe.js → suggestionFormUrl` — boş bırakılırsa link basılmıyor, kalemlik dekora dönüyor. |

### Çalar adası

Radyoya ilk dokunulduğunda ekranın alt-ortasında beliren küçük yüzen kutu
(`components/NowPlaying.jsx`): parça adı, ekolayzır, önceki/durdur/sonraki.
`position: fixed` — sayfanın her yerinde aynı yerde duruyor.

Duraklatınca **kaybolmuyor**: kaybolsaydı müziği geri açmak için tezgaha
kadar scroll etmek gerekirdi. Radyoya hiç dokunulmadıysa hiç görünmüyor
(`AppState → radioTouched`). Parça değiştirmek çalma durumunu bozmuyor.

Liste sayfa açılırken bir kez karıştırılıyor (Fisher-Yates, `AppState`).
Her parça değişiminde yeniden karıştırılsaydı "önceki şarkı" az önce
dinlenen parçaya dönmezdi; sıra sayfa yenilenince değişiyor.

**Kaydırma:** Sayfa içi tüm `#` bağlantıları ışınlamak yerine kayarak
gidiyor — tek bir belge dinleyicisi devralıyor (`hooks/useSmoothAnchors.js`),
her bağlantıya ayrı kod bağlanmıyor. Orta tık ve Ctrl+tık'a karışmıyor,
adres çubuğundaki `#menu` kuyruğunu da bilerek yazmıyor (hash'i değiştirmek
tarayıcıyı kendi sert atlamasını yapmaya çağırıyor, animasyonun üstüne
biniyor).

**Önemli:** `scrollIntoView({behavior:'smooth'})` bu projede güvenilmez çıktı
(kimi zaman hiç kıpırdamıyor, kimi zaman yolun ortasında kalıyor; araya sert
bir `scrollTo` koymak da tarayıcının süren animasyonuyla yarışa giriyor).
CSS'teki `scroll-behavior: smooth` de aynı motoru kullanıyor. Kaydırma bu
yüzden `components/scrollToId.js` içinde elle animasyonlanıyor.

**Önemli — requestAnimationFrame kullanma.** Sekme arka plandayken rAF hiç
tetiklenmiyor; kullanıcı siteyi yeni sekmede açtıysa perde sonsuza kadar
açık kalıyor, kapı hiçbir yere götürmüyor. İkisi de bu yüzden `setInterval`
ile ve geçen süreye bakarak sürülüyor (`Preloader.jsx`, `scrollToId.js`).

**Önemli:** Hover'da çizimin HTML'ini değiştirme. İki hâl de DOM'da duruyor,
seçimi CSS yapıyor (`.fprop__art--hot`). innerHTML'i hover'da değiştirince
mousedown'ın indiği düğüm yok oluyor ve **tıklama düşüyor** — lambanın ve
kapının tıklaması tam olarak bu yüzden çalışmıyordu.

Sunset'in zemin rengi orijinalden ölçüldü; ışık hüzmesi ve pencere ışığı ise
CSS ile kuruldu (çizim değil) — orijinaldeki karşılıkları DOM'da bulunamadı.

Klavyeyle gezinilebilir: tüm etkileşimli öğeler Tab ile focus alıyor ve
focus hover state'ini tetikliyor. `prefers-reduced-motion` destekleniyor.

## Yapı

```
src/
  config/cafe.js     → TÜM içerik burada
  state/AppState.jsx → sunset + müzik durumu (lamba/radyo buradan besleniyor)
  art/framerScene.js → tezgah çizimleri (ÜRETİLMİŞ, elle düzenleme)
  art/framerRoom.js  → oda çizimleri  (ÜRETİLMİŞ, elle düzenleme)
  art/Scenery.jsx    → bulut dekoru
  components/Stage.jsx → iki sahnenin ortak tuval iskeleti
  components/        → etkileşim + bölümler
  styles/            → tokens.css (palet), app.css
scripts/build-scene.mjs → çıkarılan JSON'u art/*.js'e çeviren üreteç
docs/                → etkileşim notları, çıkarma tarifi
```

## Mobil

Kırılım noktaları `styles/app.css` → "Dar ekran" bölümünde. Üçü var:
**900px** (tablet: sabit başlık sıkışıyor), **640px** (telefon: tek sütun),
ve ayrıca **yatay telefon** — orada sorun genişlik değil yükseklik.

Bilinmesi gereken iki şey:

- **Tezgah sahnesi telefonda ekranı doldurmuyor.** 1099px'lik tuval
  genişliğe sığdırılınca ~180px'lik bir şeride iniyor; `100dvh`'lik
  kutuda bu, üstte yarım ekran boşluk demekti. Telefonda sahne kendi
  boyuna dönüyor, sayfa doğrudan menüye akıyor.
- **Fiyat/numara etiketleri ters ölçekleniyor.** Onlar tuvalin içinde
  duruyor, yani çizimle birlikte 0.33 katına iniyordu (12px → ~4px).
  `Stage.jsx` o anki ölçeği `--stage-scale` olarak veriyor, CSS tersiyle
  çarpıp yazıyı gerçek boyuna döndürüyor. **Çizimin İÇİNDEKİ balonlar
  (makine, demlik, saat) bu işleme girmiyor** — onlar çizimin parçası,
  büyütülürse balonun dışına taşarlar.

Çentik/ev çubuğu payı `--safe-top` / `--safe-bottom` değişkenlerinden
geliyor (`tokens.css`); güvenli alanı olmayan aygıtta ikisi de `0px`.
Sabit başlıkla ilgili bir ölçü değiştirirsen bu değişkenleri korumayı
unutma, yoksa iPhone'da başlık çentiğin altına giriyor.

## Palet

`#fffcf5` cream · `#511f20` ink · `#ff2c47` accent · `#ff4a62` hover ·
`#e5dece` beige · `#785449` brown — hepsi `src/styles/tokens.css` içinde CSS
değişkeni olarak tanımlı.

Tipografi: Fragment Mono (Google Fonts).

## Yapılacaklar

- **Scroll'da takılı hover — açık hata.** Bir öğenin üstündeyken fareyi oynatmadan
  kaydırınca hover state'i takılı kalıyor. `src/hooks/useHover.js` içine bir düzeltme
  yazıldı ama **çalıştığı doğrulanamadı**; dosyanın başındaki nota bak. İlk iş bunu
  elle test etmek.
- **Şubeler ekranının tasarımı konuşulmadı** — şu an sade bir liste
  (`LocationsSection.jsx`, içerik `cafe.js → locations`).
- Saatin hover'ı orijinalde animasyon; statik çıkarma onu yakalamıyor. İstenirse
  CSS keyframe ile elle eklenebilir.
- Kapının açılışı CSS'te perspektifli bir `rotateY` — orijinalin "open" varyantı
  DOM'dan çekilemedi (kapı açılınca sahne unmount oluyor). Görsel olarak aynı iş
  görüyor ama surat "şaşkın" hâline dönmüyor.
- Bulutlar hâlâ elle yazılmış çizim — sahneler gibi orijinalden çıkarılabilir.
- Telefonun hover çizimi hiç basılmıyor: orijinalde balonunda sitenin
  sahibinin kişisel e-postası vardı. Hover'da sadece numara çıkıyor.
- Oda sahnesinde krem dolgulu bir figür var (sandalyede oturan biri). Krem
  zeminde görünmüyor, **sunset'te beliriyor**. Orijinalin kendi çizimi;
  istenmezse `chair-0` statik dekordan çıkarılabilir.
- Mobil düzen ölçekleme ile çözüldü; dar ekran için ayrı sahne yerleşimi iyi olur
- Menüye fotoğraf veya alerjen bilgisi eklenebilir
