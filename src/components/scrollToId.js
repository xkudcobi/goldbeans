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

export default function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return false

  const from = window.scrollY
  const max = document.documentElement.scrollHeight - window.innerHeight
  const to = Math.max(0, Math.min(el.getBoundingClientRect().top + from - OFFSET, max))

  if (
    document.hidden ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    window.scrollTo(0, to)
    return true
  }

  const start = performance.now()
  const timer = setInterval(() => {
    const t = Math.min((performance.now() - start) / SCROLL_MS, 1)
    const ease = 1 - (1 - t) ** 3
    window.scrollTo(0, from + (to - from) * ease)
    if (t >= 1) clearInterval(timer)
  }, 16)

  return true
}
