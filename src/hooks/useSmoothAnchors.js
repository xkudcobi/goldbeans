import { useEffect } from 'react'
import scrollToId from '../components/scrollToId.js'

/*
 * Sayfa içi '#' bağlantıları bir anda ışınlamak yerine kayarak götürsün.
 *
 * TEK YERDEN: her bağlantıya ayrı onClick bağlamak yerine belgeye tek bir
 * dinleyici koyuyoruz. Sahnedeki fincanlar, kahve makinesi, demlik, üstteki
 * menü/ziyaret bağlantıları — hepsi <a href="#..."> olduğu için kendiliğinden
 * kapsama giriyor; sonradan eklenenler de öyle.
 *
 * href OLDUĞU GİBİ KALIYOR: orta tık ve Ctrl+tık yeni sekmede açmaya devam
 * ediyor, tarayıcı durum çubuğunda hedef görünüyor. Aşağıdaki koşullar da
 * bu yüzden var — kullanıcı yeni sekme istiyorsa araya girmiyoruz.
 *
 * Adres çubuğundaki '#menu' kuyruğunu bilerek YAZMIYORUZ: hash'i değiştirmek
 * tarayıcıyı kendi sert atlamasını yapmaya çağırıyor, animasyonun üstüne
 * biniyordu.
 */
export default function useSmoothAnchors() {
  useEffect(() => {
    const onClick = (e) => {
      /* sol tık ve değiştirici tuş yoksa devral */
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const a = e.target.closest?.('a[href]')
      if (!a || a.target === '_blank') return

      const href = a.getAttribute('href')
      if (!href?.startsWith('#') || href === '#') return

      /* hedef yoksa karışmıyoruz — tarayıcı ne yapıyorsa onu yapsın */
      if (scrollToId(href.slice(1))) e.preventDefault()
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
