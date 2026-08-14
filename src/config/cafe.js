/*
 * ============================================================
 *  KAFE İÇERİĞİ — sitedeki tüm metin ve veri burada
 * ============================================================
 * Siteyi kendine uyarlamak için SADECE bu dosyayı düzenlemen yeterli.
 * Bileşenlere dokunmana gerek yok.
 */

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
    roomMug: ['ISIRMAK VE', 'YAZMAK İÇİN'],
  },

  /*
   * Radyonun çaldığı parça. Henüz seçilmedi — src boşken düğme çalışıyor
   * ama ses çıkmıyor. Dosyayı public/ içine koyup src'yi '/muzik.mp3'
   * yapman yeterli, başka hiçbir yeri değiştirmene gerek yok.
   */
  music: { src: '', title: '', volume: 0.5 },

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
    { days: 'Pazartesi — Cuma', time: '07:30 — 19:00' },
    { days: 'Cumartesi', time: '08:30 — 20:00' },
    { days: 'Pazar', time: '09:00 — 17:00' },
  ],

  address: {
    lines: ['Bağdat Caddesi No. 42', 'Kadıköy, İstanbul'],
    // Kendi konumunun linkini buraya koy
    mapUrl: 'https://maps.google.com/?q=Kadıköy+İstanbul',
  },

  contact: {
    phone: '+90 216 000 00 00',
    email: 'merhaba@goldbeans.com',
    instagram: '@goldbeans',
    instagramUrl: 'https://instagram.com',
  },

  /*
   * Şubeler — kapıdan girince açılan ekran.
   * Bu ekranın tasarımı henüz konuşulmadı; şimdilik sade bir liste.
   */
  locations: [
    {
      name: 'Kadıköy',
      lines: ['Bağdat Caddesi No. 42', 'Kadıköy, İstanbul'],
      hours: '07:30 — 19:00',
      mapUrl: 'https://maps.google.com/?q=Kadıköy+İstanbul',
    },
    {
      name: 'Karaköy',
      lines: ['Kemankeş Caddesi No. 9', 'Beyoğlu, İstanbul'],
      hours: '08:00 — 22:00',
      mapUrl: 'https://maps.google.com/?q=Karaköy+İstanbul',
    },
    {
      name: 'Alsancak',
      lines: ['Kıbrıs Şehitleri Caddesi No. 71', 'Konak, İzmir'],
      hours: '08:00 — 20:00',
      mapUrl: 'https://maps.google.com/?q=Alsancak+İzmir',
    },
  ],

  // --- Alt bilgi ---
  footerNote: 'Çekirdekler haftalık kavruluyor. Sütsüz alternatifler ek ücretsiz.',
}

export default cafe
