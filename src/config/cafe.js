/*
 * ============================================================
 *  KAFE İÇERİĞİ — sitedeki tüm metin ve veri burada
 * ============================================================
 * Siteyi kendine uyarlamak için SADECE bu dosyayı düzenlemen yeterli.
 * Bileşenlere dokunmana gerek yok.
 */

/*
 * Şube haritası linki üretir.
 *
 * NEDEN BÖYLE: her şubenin `mapUrl`i, Google Maps'te o İŞLETME KAYDINA
 * kilitli bir link. Adres araması değil — o yüzden Maps açılınca üstte
 * sokak adı değil işletmenin adı yazıyor, ve kullanıcının çevresindeki
 * başka GoldBeans'ler listelenmiyor.
 *
 * Linklerin biçimi:
 *   /maps/place/<İşletme+Adı>/@<lat>,<lng>,<zoom>/data=!4m6!3m5
 *     !1s<ftid>          ← Google'ın o kayda verdiği kimlik, kilit burada
 *     !8m2!3d<lat>!4d<lng>
 *     !16s<fid>
 * Maps'ten kopyalanan adreslerdeki `?entry=ttu&g_ep=...` kuyruğu sadece
 * oturum/telemetri bilgisi; atıldı, linkin çalışmasına etkisi yok.
 *
 * YENİ ŞUBE EKLERKEN: Maps'te işletmeyi aç, adres çubuğundaki linki
 * `mapUrl`e yapıştır (`?entry=` sonrasını silebilirsin). `mapUrl` yoksa
 * `address` alanından adres araması yapan bir link üretilir — daha
 * zayıftır, işletme kaydı olmayan şube için idare eder.
 */
export function branchMapUrl(branch) {
  if (branch.mapUrl) return branch.mapUrl
  if (!branch.address) return null
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`
}

/*
 * Şubenin telefonu. Kendi hattı olmayan şubeler merkez numaraya düşüyor —
 * yeni şube eklerken `phone` alanını hiç yazmaman yeterli.
 *
 * Hiç numara GÖSTERİLMESİN isteniyorsa (henüz açılmamış İstanbul gibi)
 * `phone: null` yazılıyor. `??` null'ı da boş sayacağı için alanın
 * yazılmamış olmasıyla bile bile null yapılmasını ayırt etmek gerekiyor.
 */
export function branchPhone(branch) {
  return 'phone' in branch ? branch.phone : cafe.contact.phone
}

/*
 * `tel:` linki numarayı okunur haliyle kabul etmiyor — boşluk, parantez ve
 * tire atılıyor, sadece rakamlar (ve varsa baştaki +) kalıyor.
 */
export const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

/*
 * Şube fotoğraflarının tam yolları. cafe.js'te 'subeler/x.jpg' diye
 * yazılıyor, başına sitenin taban yolu ekleniyor — dev'de '/', GitHub
 * Pages'te '/<repo>/'. Başında / ile yazılmışsa da çalışsın diye atılıyor.
 */
export function branchPhotos(branch) {
  return (branch.photos ?? []).map(
    (p) => encodeURI(import.meta.env.BASE_URL + p.replace(/^\//, '')),
  )
}

export const cafe = {
  // --- Kimlik ---
  name: 'GoldBeans',
  tagline: 'more than coffee',
  // oda sahnesindeki posterin üstündeki yazı
  posterText: 'MORE THAN COFFEE',

  /*
   * Açılış perdesinde harf harf yazılan satırlar.
   * Sıra önemli — sonuncusu ekranda kalırken perde açılıyor.
   * Satır ekleyip çıkarmak perdenin süresini de değiştirir.
   */
  loadingLines: [
    '(selam)',
    '(hemen geliyorum)',
    '(yükleniyor...)',
    '(hoş geldiniz)',
  ],

  /*
   * Öğelerin üstüne gelince çıkan konuşma balonlarının yazıları.
   *
   * Balonun kendisi orijinal çizimin parçası — biz sadece içindeki metni
   * değiştiriyoruz. Satır sayısı ÇİZİMDE sabit, o yüzden diziler aynı
   * uzunlukta kalmalı; satır ekleyemezsin, sadece metni değiştirebilirsin.
   */
  tips: {
    // tezgah
    lamp: 'SUNSET MOOD',
    clock: 'KAHVE SAATİ GELDİ',
    machine: ['MİS GİBİ', 'KAHVE KOKTU'],
    kettle: ['BU SOĞUMUŞ...', 'BİR TANE DAHA AL,', 'BENDEN OLSUN'],
    /* bitkininki çizimde boş geldi — balonun üstüne biz basıyoruz */
    plant: "GOLDBEANS'E HOŞ GELDİN",
    radio: ["SHAZAM'LAYIP BİR DAHA", 'AÇMAYACAĞIN ŞARKI'],
    /*
     * Oda. Telefonun balonu hiç basılmıyor (orijinalde sitenin sahibinin
     * e-postası vardı) — hover'da sadece numara çıkıyor, bkz. RoomScene.
     */
    roomMug: ['ÖNERİLERİNİ', 'DUYALIM'],
  },

  /*
   * Radyonun çaldığı liste. Sırayla çalıyor, sonuncu bitince başa dönüyor
   * (bkz. state/AppState.jsx). Parça eklemek/çıkarmak için sadece burası:
   * dosyayı public/music/ içine at, src'yi '/music/dosya-adi.mp3' yaz.
   * Dosya adındaki boşluklar AppState'te encodeURI ile çözülüyor.
   */
  music: {
    volume: 0.35,
    tracks: [
      { src: '/music/Daft Punk - Around The World.mp3', title: 'Daft Punk — Around The World' },
      { src: '/music/Superlover - The Talking Machine.mp3', title: 'Superlover — The Talking Machine' },
      { src: '/music/James Hype, Miggy Dela Rosa - Ferrari.mp3', title: 'James Hype, Miggy Dela Rosa — Ferrari' },
      { src: '/music/Eagles - Hotel California (Live 1977).mp3', title: 'Eagles — Hotel California (Live 1977)' },
    ],
  },

  /*
   * Raftaki fincanlar = öne çıkan içecekler.
   * Sahnede 4 fincan var; sırayla bu listeden besleniyor. Fiyatlar
   * aşağıdaki menüyle AYNI olmalı — menüde fiyat değişirse burayı da güncelle.
   * `note` isteğe bağlı (boşsa etikette basılmıyor).
   * `shape` sadece çizim varyantı (0 veya 1).
   */
  signatures: [
    { name: 'Flat White', note: 'sıcak kahve', price: '220 TL', shape: 0 },
    { name: 'Filtre Kahve', note: 'sıcak kahve', price: '200 TL', shape: 1 },
    { name: 'Cortado', note: 'sıcak kahve', price: '200 TL', shape: 1 },
    { name: 'Sıcak Çikolata', note: 'sıcak favori', price: '180 TL', shape: 0 },
  ],

  /*
   * --- Menü ---
   * Kaynak: "MENÜ son.pdf". Gruplar ve sıra PDF'teki gibi.
   * `note` isteğe bağlı: ürünün altında küçük yazıyla çıkıyor.
   */
  menu: [
    {
      group: 'Sıcak Kahveler',
      items: [
        { name: 'Espresso', price: '130 TL' },
        { name: 'Filtre Kahve', price: '200 TL' },
        { name: 'Americano', price: '200 TL' },
        { name: 'Latte', price: '220 TL' },
        { name: 'Mocha', price: '230 TL' },
        { name: 'White Mocha', price: '230 TL' },
        { name: 'İtalyan Karamel', price: '240 TL' },
        { name: 'Karamel Latte', price: '230 TL' },
        { name: 'Cortado', price: '200 TL' },
        { name: 'Cappuccino', price: '220 TL' },
        { name: 'Flat White', price: '220 TL' },
        { name: 'Caramel Macchiato', price: '240 TL' },
        { name: 'Toffee Nut Latte', price: '230 TL' },
        { name: 'Vanilya Latte', price: '230 TL' },
        { name: 'Ube Latte', price: '240 TL' },
        { name: 'Cookie Latte', price: '230 TL' },
        { name: 'Cremee Brule Latte', price: '230 TL' },
        { name: 'Pumpkin Spice Latte', price: '230 TL' },
        { name: 'Lotus Latte', price: '230 TL' },
        { name: 'Marshmallow Latte', price: '230 TL' },
        { name: 'Pistachio Latte', price: '240 TL' },
        { name: 'Türk Kahvesi', price: '130 TL' },
      ],
    },
    {
      group: 'Soğuk Kahveler',
      items: [
        { name: 'Ice Americano', price: '200 TL' },
        { name: 'Ice Latte', price: '220 TL' },
        { name: 'Ice Mocha', price: '230 TL' },
        { name: 'Ice White Mocha', price: '230 TL' },
        { name: 'Ice Vanilya Latte', price: '230 TL' },
        { name: 'Ice Karamel Latte', price: '230 TL' },
        { name: 'Ice Toffee Nut Latte', price: '230 TL' },
        { name: 'Ice Karamel Macchiato', price: '240 TL' },
        { name: 'Ice İtalyan Karamel Latte', price: '240 TL' },
        { name: 'Ice Cremee Brule Latte', price: '230 TL' },
        { name: 'Ice Pumpkin Spice Latte', price: '230 TL' },
        { name: 'Ice Lotus Latte', price: '230 TL' },
        { name: 'Ice Marshmallow Latte', price: '230 TL' },
        { name: 'Ice Pistachio Latte', price: '240 TL' },
        { name: 'Cold Brew', price: '250 TL' },
      ],
    },
    {
      group: 'Sıcak Favoriler',
      items: [
        { name: 'Siyah Çay', price: '50 TL' },
        { name: 'Fincan Çay', price: '80 TL' },
        { name: 'Ihlamur', price: '180 TL' },
        { name: 'Kış Çayı', price: '180 TL' },
        { name: 'Sıcak Çikolata', price: '180 TL' },
        { name: 'Beyaz Sıcak Çikolata', price: '180 TL' },
        { name: 'Ruby Sıcak Çikolata', price: '180 TL' },
        { name: 'Sahlep', price: '180 TL' },
        { name: 'Chai Tea', price: '180 TL' },
      ],
    },
    {
      group: 'Soğuk Favoriler',
      items: [
        { name: 'Churchill', price: '130 TL' },
        { name: 'Limonata', price: '180 TL' },
        { name: 'Çilekli Limonata', price: '200 TL' },
        { name: 'Cool Lime', price: '220 TL' },
        { name: 'RedBull', price: '200 TL' },
        {
          name: 'Frozen',
          note: 'çilek, yeşil elma, yaban mersini, mango, orman meyveleri',
          price: '220 TL',
        },
        { name: 'Milkshake', note: 'çikolata, çilek, vanilya, karamel', price: '220 TL' },
        { name: 'Berry Hibiscus', price: '220 TL' },
        { name: 'Burn', price: '200 TL' },
        { name: 'Soda Limon', price: '130 TL' },
        { name: 'Su', price: '40 TL' },
        { name: 'Soda', price: '80 TL' },
      ],
    },
    {
      group: 'Tatlılar',
      items: [
        { name: 'Tiramisu', price: '250 TL' },
        { name: 'Spoonful', price: '250 TL' },
        { name: 'Magnolia', price: '250 TL' },
        { name: 'Lotus Cup', price: '250 TL' },
        { name: 'Strawberry Cup', price: '250 TL' },
      ],
    },
    {
      group: 'Ekstra',
      items: [
        { name: 'Shot', price: '50 TL' },
        { name: 'Badem Sütü', price: '50 TL' },
        { name: 'Yulaf Sütü', price: '50 TL' },
      ],
    },
  ],

  // --- Ziyaret ---
  hours: [
    { days: 'Pazartesi — Cumartesi', time: '09:00 — 01:00' },
    { days: 'Pazar', time: '10:00 — 01:00' },
  ],

  contact: {
    /*
     * `phone` merkez numara: İletişim'de ilk sırada, odadaki telefon ve
     * alt bilgi bunu kullanıyor. Ayrıca kendi numarası girilmemiş her
     * şube de buna düşüyor (bkz. branchPhone).
     */
    phone: '0 (553) 827 44 89',
    /*
     * Şu an tüm şubeler tek hattan geçiyor, o yüzden liste tek satır ve
     * `label` boş — şehir etiketi ayırt edecek ikinci numara olmadığında
     * anlamsız. Şubeye özel hat açılırsa buraya {label, number} eklemek
     * yeterli, VisitSection etiketi olanı basıyor.
     */
    phones: [{ label: '', number: '0 (553) 827 44 89' }],
    email: 'info@goldbeanscoffeehouse.com',
    instagram: '@goldbeanscoffeehouse',
    instagramUrl: 'https://www.instagram.com/goldbeanscoffeehouse/',
  },

  /*
   * Öneri ve şikayet formu — oda sahnesindeki kalemliğe tıklayınca yeni
   * sekmede açılıyor (components/RoomScene.jsx).
   *
   * Google Forms'ta formu aç → Gönder → bağlantı sekmesi → çıkan adresi
   * buraya yapıştır (.../viewform ile biten hâli).
   *
   * BOŞ BIRAKILIRSA kalemlik tıklanmaz olur, sadece balonu çıkar — yani
   * kırık link yerine hiç link olmaz.
   */
  suggestionFormUrl: 'https://forms.gle/hXJZd1bkiJBvHsk26',

  /*
   * Şubeler — kapıdan girince açılan ekran.
   *
   * `name`  : SİTEDE görünen ad. Maps'teki kayıt adı bundan farklı
   *           olabilir (bkz. her şubenin üstündeki not) — site kendi
   *           adını kullanıyor, link yine doğru kayda gidiyor.
   * `lines` : ekranda okunan adres.
   * `mapUrl`: tıklanınca açılan Maps kaydı. Bkz. branchMapUrl().
   * `soon`  : true ise henüz açılmadı.
   * `soonNote`: açılmamış şubenin fotoğrafı yoksa kapakta kum saatinin
   *           altında yazan not (yoksa 'çok yakında').
   * `photos`: şube kartına dokununca açılan galerinin fotoğrafları.
   *           Dosyaları public/subeler/ içine at, buraya adlarını yaz:
   *             photos: ['subeler/cadde-1.jpg', 'subeler/cadde-2.jpg'],
   *           Baştaki / OLMADAN yaz — site alt yolda yayınlanınca da
   *           çalışsın diye taban yolu otomatik ekleniyor. İlk fotoğraf
   *           kartın kapağı oluyor. Liste boşsa kartta "fotoğraflar
   *           yakında" yazıyor; pencere yine açılıyor (adres, telefon, harita).
   *           Önerilen: ~1000px genişlik, JPG, tanesi < 300 KB. Dikey de olur.
   */
  locations: [
    {
      name: 'Goldbeans Cadde',
      lines: ['Kırtepe, Hükümet Cd. No:12/G', '74100 Merkez / Bartın'],
      photos: [
        'subeler/cadde-1.jpg',
        'subeler/cadde-2.jpg',
        'subeler/cadde-3.jpg',
        'subeler/cadde-4.jpg',
      ],
      /* numara girilmedi → merkez numaraya düşüyor, bkz. branchPhone */
      /* Maps'te kayıt adı sadece "Goldbeans" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans/@41.6335045,32.3373057,19z/data=!4m6!3m5!1s0x409b73defb794f3d:0x51c74f91a7efd68f!8m2!3d41.6335045!4d32.3373057!16s%2Fg%2F11jsnwpcdl',
    },
    {
      name: 'Goldbeans Garden',
      lines: ['Demirciler, Rıfat Ilgaz Sk. No:49', '74100 Merkez / Bartın'],
      photos: [
        'subeler/garden-1.jpg',
        'subeler/garden-2.jpg',
        'subeler/garden-3.jpg',
        'subeler/garden-4.jpg',
        'subeler/garden-5.jpg',
      ],
      /* Maps'te "Goldbeans Garden Coffee" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+Garden+Coffee/@41.63057,32.33922,19z/data=!4m6!3m5!1s0x409b7300621d0249:0x7691b6a712961342!8m2!3d41.63057!4d32.33922!16s%2Fg%2F11nr23tcgp',
    },
    {
      name: 'Goldbeans İnkum',
      lines: ['İskele Cad. 15 Nolu Sk. No:44/A', '74110 Merkez / Bartın'],
      photos: [
        'subeler/inkum-1.jpg',
        'subeler/inkum-2.jpg',
        'subeler/inkum-3.jpg',
      ],
      /* Maps'te "Goldbeans İnkumu" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+%C4%B0nkumu/@41.669224,32.2273824,18z/data=!4m6!3m5!1s0x409b75002c064747:0xc24e3d42a6d523f1!8m2!3d41.669224!4d32.2273824!16s%2Fg%2F11zgs01cw1',
    },
    {
      name: 'Goldbeans Zonguldak',
      lines: ['Meşrutiyet, Gazi Paşa Cd.', '67000 Merkez / Zonguldak'],
      photos: ['subeler/zonguldak-1.jpg', 'subeler/zonguldak-2.jpg'],
      /* kendi hattı kalmadı → merkez numaraya düşüyor, bkz. branchPhone */
      /* Maps'te "Goldbeans Coffee Zonguldak" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+Coffee+Zonguldak/@41.4533647,31.7896132,17z/data=!4m6!3m5!1s0x409c7d007fe39d4b:0x7ac7be50e430d4ce!8m2!3d41.4533647!4d31.7896132!16s%2Fg%2F11ypgbxvvg',
    },
    {
      name: 'GoldChef Yalı',
      lines: ['Orduyeri, Tersane Cd. 7', '74100 Merkez / Bartın'],
      photos: ['subeler/chef-1.jpg'],
      /* Maps'te bu kayıt "Goldbeans" adıyla duruyor */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans/@41.6385895,32.3368646,19z/data=!4m6!3m5!1s0x409b730078c2bfb1:0x9cce383319e55f4!8m2!3d41.6385895!4d32.3368646!16s%2Fg%2F11x88n23t6',
    },
    {
      /* GoldChef Yalı ile aynı adres ve Maps kaydı */
      name: 'Goldbeans Yalı',
      lines: ['Orduyeri, Tersane Cd. 7', '74100 Merkez / Bartın'],
      photos: [
        'subeler/yali-1.jpg',
        'subeler/yali-2.jpg',
        'subeler/yali-3.jpg',
        'subeler/yali-4.jpg',
        'subeler/yali-5.jpg',
        'subeler/yali-6.jpg',
        'subeler/yali-7.jpg',
        'subeler/yali-8.jpg',
      ],
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans/@41.6385895,32.3368646,19z/data=!4m6!3m5!1s0x409b730078c2bfb1:0x9cce383319e55f4!8m2!3d41.6385895!4d32.3368646!16s%2Fg%2F11x88n23t6',
    },
    {
      name: 'Goldbeans Meydan',
      lines: ['Kırtepe, Gümrük Sk.', 'Güney Akrabaoğlu Sitesi', '74100 Merkez / Bartın'],
      photos: ['subeler/meydan-1.jpg'],
      /* Maps'te kayıt hâlâ "Colombia Coffee Bartın" adında */
      mapUrl:
        'https://www.google.com/maps/place/Colombia+Coffee+Bart%C4%B1n/@41.636995,32.3336801,20z/data=!4m6!3m5!1s0x409b73a9de921b5b:0xc887fbf3a1727987!8m2!3d41.636995!4d32.3336801!16s%2Fg%2F11vdn_wtmr',
    },
    {
      name: 'Goldbeans İstanbul',
      lines: ['Çok yakında...'],
      photos: [],
      // Maps kaydı yok → harita linki de basılmıyor
      phone: null, // henüz hattı yok, merkez numaraya da düşmesin
      soon: true,
      soonNote: 'İstanbul demleniyor…',
    },
  ],

  // --- Alt bilgi ---
  footerNote: '*Ürünlerimiz süt, yumurta, gluten, kuruyemiş gibi alerjenler içerebilir.',
}

export default cafe
