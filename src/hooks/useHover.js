import { useCallback, useEffect, useState } from 'react'

/*
 * Hover state'i + scroll temizliği.
 *
 * NEDEN: Sayfa kaydırılırken öğe sabit duran imlecin altından çıkınca tarayıcı
 * `mouseleave`'i tetiklemiyor — bir sonraki fare hareketine kadar bekliyor.
 * Sonuç: fincan/lamba imleç üstünde olmadığı hâlde hover'da takılı kalıyor.
 *
 * Çözüm: scroll başladığında state'i temizle. Fare gerçekten öğenin üstündeyse
 * bir sonraki mousemove zaten yeniden tetikliyor, yani kayıp yok.
 *
 * ⚠️ DOĞRULANMADI — bu kod derleniyor ama düzeltmenin işe yaradığı GÖSTERİLEMEDİ.
 * Yapılan test: mug'a sentetik mouseover → scrollBy(0,220) → `is-hot` hâlâ duruyordu.
 * Araştırırken window'a hiç 'scroll' eventi düşmediği görüldü ki bu beklenmedik,
 * çünkü CloudIntro.jsx aynı yöntemle sorunsuz çalışıyor. Test oturumu hemen
 * ardından çöktü, dolayısıyla ölçüm de şüpheli.
 *
 * Elle doğrula: bir fincanın üstüne gel, FAREYİ OYNATMADAN tekerlekle kaydır.
 * Fincan pembe kalıyorsa düzeltme çalışmıyor demektir. O durumda denenecekler:
 *   1) listener'ı `document`e veya capture:true ile bağla
 *   2) 'scroll' yerine 'wheel' + 'touchmove' dinle
 *   3) JS state yerine saf CSS :hover kullan (tarayıcı kendi düzeltir)
 */
export default function useHover() {
  const [hot, setHot] = useState(false)

  useEffect(() => {
    if (!hot) return
    const clear = () => setHot(false)
    window.addEventListener('scroll', clear, { passive: true })
    return () => window.removeEventListener('scroll', clear)
  }, [hot])

  const on = useCallback(() => setHot(true), [])
  const off = useCallback(() => setHot(false), [])

  // doğrudan JSX'e yayılabilir
  const bind = {
    onMouseEnter: on,
    onMouseLeave: off,
    onFocus: on,
    onBlur: off,
  }

  return [hot, bind]
}
