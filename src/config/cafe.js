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

export const cafe = {
  // --- Kimlik ---
  name: 'GoldBeans',
  tagline: 'more than coffee',
  // oda sahnesindeki posterin üstündeki yazı
  posterText: 'MORE THAN COFFEE',
  intro: [
    'Galeri değil, buluşma yeri',
    'Bir yudum al, biraz kal',
  ],

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

  // --- Tezgah sahnesi başlığı ---
  counterKicker: 'HER FİNCAN ELDE DEMLENİR. BUYUR, TAT.',

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
   * Raftaki fincanlar = imza içecekler.
   * Sahnede 4 fincan var; sırayla bu listeden besleniyor.
   * `shape` sadece çizim varyantı (0 veya 1).
   */
  signatures: [
    { name: 'Flat White', note: 'çift shot, ipeksi süt', price: '₺95', shape: 0 },
    { name: 'Filtre Kahve', note: 'günün çekirdeği, V60', price: '₺75', shape: 1 },
    { name: 'Cortado', note: 'eşit ölçü, sert ve kısa', price: '₺85', shape: 1 },
    { name: 'Sıcak Çikolata', note: '%70 bitter, ev yapımı', price: '₺90', shape: 0 },
  ],

  // --- Menü ---
  menu: [
    {
      group: 'Espresso Bar',
      items: [
        { name: 'Espresso', note: 'tek / çift', price: '₺55 / ₺70' },
        { name: 'Americano', note: '', price: '₺75' },
        { name: 'Flat White', note: 'çift shot', price: '₺95' },
        { name: 'Cappuccino', note: '', price: '₺90' },
        { name: 'Latte', note: 'sade / aromalı', price: '₺90 / ₺100' },
        { name: 'Cortado', note: '', price: '₺85' },
      ],
    },
    {
      group: 'Demleme',
      items: [
        { name: 'V60', note: 'tek origin, günlük değişir', price: '₺85' },
        { name: 'Chemex', note: 'iki kişilik', price: '₺140' },
        { name: 'Cold Brew', note: '16 saat demleme', price: '₺90' },
        { name: 'Türk Kahvesi', note: 'sade / orta / şekerli', price: '₺60' },
      ],
    },
    {
      group: 'Kahve Dışı',
      items: [
        { name: 'Sıcak Çikolata', note: '%70 bitter', price: '₺90' },
        { name: 'Matcha Latte', note: 'tören sınıfı matcha', price: '₺110' },
        { name: 'Demleme Çay', note: 'siyah / yeşil / bitki', price: '₺50' },
        { name: 'Taze Limonata', note: 'nane ile', price: '₺70' },
      ],
    },
    {
      group: 'Fırın',
      items: [
        { name: 'Tereyağlı Kruvasan', note: 'sabah tazesi', price: '₺75' },
        { name: 'Badem Kurabiyesi', note: '', price: '₺60' },
        { name: 'Günün Keki', note: 'tezgaha sor', price: '₺80' },
        { name: 'Avokadolu Ekmek', note: 'ekşi maya, susam', price: '₺135' },
        { name: 'Peynirli Poğaça', note: '', price: '₺65' },
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
    phone: '0378 228 43 77',
    phones: [
      { label: 'Bartın', number: '0378 228 43 77' },
      { label: 'Zonguldak', number: '0546 814 06 51' },
    ],
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
   */
  locations: [
    {
      name: 'Goldbeans Cadde',
      lines: ['Kırtepe, Hükümet Cd. No:12/G', '74100 Merkez / Bartın'],
      /* numara girilmedi → merkez numaraya düşüyor, bkz. branchPhone */
      /* Maps'te kayıt adı sadece "Goldbeans" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans/@41.6335045,32.3373057,19z/data=!4m6!3m5!1s0x409b73defb794f3d:0x51c74f91a7efd68f!8m2!3d41.6335045!4d32.3373057!16s%2Fg%2F11jsnwpcdl',
    },
    {
      name: 'Goldbeans Garden',
      lines: ['Demirciler, Rıfat Ilgaz Sk. No:49', '74100 Merkez / Bartın'],
      /* Maps'te "Goldbeans Garden Coffee" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+Garden+Coffee/@41.63057,32.33922,19z/data=!4m6!3m5!1s0x409b7300621d0249:0x7691b6a712961342!8m2!3d41.63057!4d32.33922!16s%2Fg%2F11nr23tcgp',
    },
    {
      name: 'Goldbeans İnkum',
      lines: ['İskele Cad. 15 Nolu Sk. No:44/A', '74110 Merkez / Bartın'],
      /* Maps'te "Goldbeans İnkumu" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+%C4%B0nkumu/@41.669224,32.2273824,18z/data=!4m6!3m5!1s0x409b75002c064747:0xc24e3d42a6d523f1!8m2!3d41.669224!4d32.2273824!16s%2Fg%2F11zgs01cw1',
    },
    {
      name: 'Goldbeans Zonguldak',
      lines: ['Meşrutiyet, Gazi Paşa Cd.', '67000 Merkez / Zonguldak'],
      phone: '0546 814 06 51',
      /* Maps'te "Goldbeans Coffee Zonguldak" */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans+Coffee+Zonguldak/@41.4533647,31.7896132,17z/data=!4m6!3m5!1s0x409c7d007fe39d4b:0x7ac7be50e430d4ce!8m2!3d41.4533647!4d31.7896132!16s%2Fg%2F11ypgbxvvg',
    },
    {
      name: 'GoldChef Yalı',
      lines: ['Orduyeri, Tersane Cd. 7', '74100 Merkez / Bartın'],
      soon: true,
      /* Maps'te bu kayıt "Goldbeans" adıyla duruyor */
      mapUrl:
        'https://www.google.com/maps/place/Goldbeans/@41.6385895,32.3368646,19z/data=!4m6!3m5!1s0x409b730078c2bfb1:0x9cce383319e55f4!8m2!3d41.6385895!4d32.3368646!16s%2Fg%2F11x88n23t6',
    },
    {
      name: 'Goldbeans Yalı',
      lines: ['Kırtepe, Gümrük Sk.', 'Güney Akrabaoğlu Sitesi', '74100 Merkez / Bartın'],
      soon: true,
      /* Maps'te kayıt hâlâ "Colombia Coffee Bartın" adında */
      mapUrl:
        'https://www.google.com/maps/place/Colombia+Coffee+Bart%C4%B1n/@41.636995,32.3336801,20z/data=!4m6!3m5!1s0x409b73a9de921b5b:0xc887fbf3a1727987!8m2!3d41.636995!4d32.3336801!16s%2Fg%2F11vdn_wtmr',
    },
    {
      name: 'Goldbeans İstanbul',
      lines: ['Çok yakında...'],
      // Maps kaydı yok → harita linki de basılmıyor
      phone: null, // henüz hattı yok, merkez numaraya da düşmesin
      soon: true,
    },
  ],

  // --- Alt bilgi ---
  footerNote: 'Çekirdekler haftalık kavruluyor. Sütsüz alternatifler ek ücretsiz.',
}

export default cafe
