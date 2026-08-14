import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/*
 * ============================================================
 *  İÇERİK GÜVENLİK POLİTİKASI (CSP)
 * ============================================================
 * Sayfanın hangi kaynaklardan bir şey yükleyebileceğini tarayıcıya söyler.
 * Listede olmayan hiçbir yerden script/stil/görsel çekilemez; bir şekilde
 * sayfaya yabancı kod sızsa bile veriyi dışarı gönderemez.
 *
 * Direktifler ne diyor:
 *   default-src 'self'  → varsayılan: sadece kendi alan adımız
 *   script-src  'self'  → SADECE paketlenmiş JS. Satır içi script yok, CDN
 *                         yok — XSS'in en yaygın yolu böyle kapanıyor.
 *   style-src   'unsafe-inline' ZORUNLU: çizimler orijinal siteden satır içi
 *                         style'larla geldi, React de style={} basıyor. Stil
 *                         için bu, script'e göre çok düşük riskli.
 *   font-src            → Fragment Mono, Google Fonts'tan geliyor
 *   img-src     data:   → çizimlerin içindeki gömülü görseller
 *   media-src   'self'  → radyodaki mp3'ler
 *   connect-src 'self'  → site hiçbir yere istek atmıyor; veri sızdırma
 *                         yolu kapalı
 *   object-src  'none'  → <object>/<embed> tamamen kapalı
 *   base-uri    'self'  → <base> enjekte edip bütün yolları başka sunucuya
 *                         çevirme numarası kapalı
 *   form-action 'none'  → sitede form yok; olsa bile başka yere post edemez
 *                         (öneri formu harici link, form değil)
 *   frame-src   'none'  → sayfaya iframe gömülemez
 *
 * frame-ancestors (clickjacking koruması) BURADA YOK: o direktif <meta> ile
 * çalışmıyor, sadece gerçek HTTP başlığıyla. Onun için public/_headers var.
 *
 * public/_headers İÇİNDE DE AYNI POLİTİKA DURUYOR — birini değiştirirsen
 * diğerini de değiştir.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

/*
 * CSP meta etiketini SADECE üretim build'ine ekler.
 *
 * NEDEN eklenti ile, index.html'e elle değil: geliştirme sunucusu React Fast
 * Refresh için sayfaya satır içi bir script basıyor. `script-src 'self'`
 * sabit dursaydı o script bloklanır, `npm run dev` beyaz ekran verirdi.
 * apply:'build' sayesinde dev dokunulmadan kalıyor, yayına giden HTML ise
 * politikayı taşıyor.
 */
function cspPlugin() {
  return {
    name: 'csp-meta',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler: () => [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP },
          injectTo: 'head-prepend',
        },
      ],
    },
  }
}

/*
 * base: GitHub Pages'te site kökte değil, /<repo>/ altında duruyor.
 * Dev'de ve KENDİ ALAN ADINDAN yayınlarken '/' olması gerekiyor, o yüzden
 * ortam değişkeniyle veriliyor — deploy iş akışı BASE_PATH'i ayarlıyor
 * (.github/workflows/deploy.yml).
 *
 * Çizimlerin içindeki varlık yolları __BASE__ yer tutucusuyla yazılıyor ve
 * bu değerle dolduruluyor (src/components/Stage.jsx).
 */
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), cspPlugin()],
})
