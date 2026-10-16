/*
 * Sayfa içi kaydırmayı kendimiz animasyonluyoruz.
 *
 * NEDEN: `scrollIntoView({behavior:'smooth'})` bu projede güvenilmez —
 * ölçüldü: kimi zaman hiç kıpırdamıyor, kimi zaman yolun ortasında kalıyor.
 * Araya sert bir `scrollTo` koymak da yarışa giriyor (tarayıcının süren
 * animasyonu geri çekiyor). CSS'teki `scroll-behavior: smooth` de aynı
 * motoru kullandığı için aynı derde düşüyor.
 *
 * requestAnimationFrame de KULLANMIYORUZ: sekme arka plandayken rAF hiç
 * çalışmıyor ve bağlantı hiçbir yere götürmüyor (ölçüldü). setInterval arka
 * planda da tikliyor; adımı geçen süreden hesapladığımız için kısılması
 * animasyonu uzatmıyor, sadece daha az kare düşürüyor.
 *
 * Kullananlar: kapı (RoomScene), sayfa içi tüm '#' bağlantıları
 * (hooks/useSmoothAnchors.js).
 */

const SCROLL_MS = 620

/* Sabit başlık yazının üstünü kesmesin diye hedefin biraz yukarısına */
const OFFSET = 92

/* Kullanıcı kendisi kaydırmaya başlarsa animasyon elini çeksin */
const USER_INPUT = ['wheel', 'touchstart', 'keydown']

/*
 * Süren animasyon. Tek seferde bir tane olmalı: art arda iki bağlantıya
 * basınca iki zamanlayıcı aynı anda scrollTo çağırıp sayfayı iki hedef
 * arasında titretiyordu.
 */
let stop = null

export default function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return false

  stop?.()

  /* Hedef kendi payını CSS'te scroll-margin-top ile isteyebiliyor (menü
     grupları: üstlerinde yapışkan kategori şeridi duruyor) */
  const extra = parseFloat(getComputedStyle(el).scrollMarginTop) || 0

  const from = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  const to = Math.max(0, Math.min(el.getBoundingClientRect().top + from - OFFSET - extra, max))

  if (
    document.hidden ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo(0, to)
    return true
  }

  let timer = 0
  const cancel = () => {
    clearInterval(timer)
    USER_INPUT.forEach((type) => window.removeEventListener(type, cancel))
    if (stop === cancel) stop = null
  }

  const start = performance.now()
  timer = setInterval(() => {
    const t = Math.min((performance.now() - start) / SCROLL_MS, 1)
    const ease = 1 - (1 - t) ** 3
    window.scrollTo(0, from + (to - from) * ease)
    if (t >= 1) cancel()
  }, 16)

  USER_INPUT.forEach((type) => window.addEventListener(type, cancel, { passive: true }))
  stop = cancel

  return true
}
