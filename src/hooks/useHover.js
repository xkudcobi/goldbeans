import { useCallback, useEffect, useRef, useState } from 'react'

/*
 * Sahne öğelerinin "üstüne gelindi" durumu — hem fare hem parmak için.
 *
 * ---- PARMAKLA NASIL ÇALIŞIYOR ----
 * Dokunmatikte hover diye bir şey yok. Eskiden sadece onMouseEnter/Leave
 * vardı ve telefonda iki şey birden bozuluyordu:
 *   1) Fincana dokununca tarayıcı sahte bir mouseenter üretip menüye
 *      atlıyordu — fiyat etiketi ekranda bir kare bile durmuyordu.
 *   2) Etiket bir kez açıldığında onu kapatacak bir olay yoktu; başka
 *      yere dokunsan da ekranda asılı kalıyordu.
 *
 * Kural şu: PARMAKLA İLK DOKUNUŞ GÖSTERİR, İKİNCİSİ GİDER. Yani fincana
 * dokununca önce fiyatı görüyorsun, menüye gitmek istersen bir daha
 * dokunuyorsun. Mobilde hover'la bilgi veren linklerin standart çözümü.
 * Bu bekleme SADECE linklerde var — lamba ve radyo gibi düğmeler tek
 * dokunuşta çalışıyor (bkz. InteractiveProp.jsx), çünkü onlarda balonun
 * anlattığı bir şey yok, dokunmanın sonucu zaten anında görülüyor.
 *
 * Fareyle hiçbir şey değişmedi: üstüne gel → açılır, çek → kapanır.
 *
 * ---- KAYDIRINCA TEMİZLİK ----
 * Sayfa kaydırılırken öğe sabit duran imlecin altından çıkınca tarayıcı
 * `mouseleave` tetiklemiyor, bir sonraki fare hareketine kadar bekliyor;
 * öğe hover'da takılı kalıyor. Parmakta da açık etiketin üstünden
 * kaydırınca aynısı oluyor. İkisini de scroll'da temizliyoruz.
 */
export default function useHover() {
  const [hot, setHot] = useState(false)
  const ref = useRef(null)
  /* Son dokunuş parmakla mıydı? "İlk dokunuş gösterir" kuralı buna bakıyor. */
  const byTouch = useRef(false)

  useEffect(() => {
    if (!hot) return

    const clear = () => setHot(false)
    window.addEventListener('scroll', clear, { passive: true })

    /*
     * Başka bir yere dokununca/tıklayınca kapansın. capture:true —
     * araya giren stopPropagation'lar bunu yutmasın diye olay daha
     * yukarıdayken yakalanıyor.
     */
    const away = (e) => {
      if (!ref.current?.contains(e.target)) setHot(false)
    }
    document.addEventListener('pointerdown', away, true)

    return () => {
      window.removeEventListener('scroll', clear)
      document.removeEventListener('pointerdown', away, true)
    }
  }, [hot])

  const on = useCallback(() => setHot(true), [])
  const off = useCallback(() => setHot(false), [])

  const bind = {
    ref,
    /* Hangi aygıtla gelindiğini pointerType söylüyor: 'mouse' | 'touch' | 'pen' */
    onPointerDown: (e) => {
      byTouch.current = e.pointerType !== 'mouse'
      if (byTouch.current) setHot(true)
    },
    /* Parmakta tarayıcı sahte enter/leave de üretiyor; onları eliyoruz,
       yoksa yukarıdaki kuralla çakışıp etiket anında kapanıyor. */
    onPointerEnter: (e) => { if (e.pointerType === 'mouse') setHot(true) },
    onPointerLeave: (e) => { if (e.pointerType === 'mouse') setHot(false) },
    /* klavyeyle gezenler için */
    onFocus: on,
    onBlur: off,
  }

  /*
   * Linklerin tıklamasını geciktiren bekçi. `true` dönerse çağıran
   * "bu dokunuş sadece gösterdi, git" demeli.
   *
   * Fare (veya zaten açık olan öğe) hiç beklemiyor.
   */
  const armedRef = useRef(false)
  /* ekranda "tekrar dokun" rozetini göstermek için durumun görünen hâli */
  const [armed, setArmed] = useState(false)
  const arm = useCallback((v) => {
    armedRef.current = v
    setArmed(v)
  }, [])

  const guard = useCallback((e) => {
    if (!byTouch.current) return false
    /* aynı öğeye ikinci dokunuş → geç */
    if (armedRef.current) { arm(false); return false }
    arm(true)
    e.preventDefault()
    setHot(true)
    return true
  }, [arm])

  /* öğe kapandığında bekçi de sıfırlanmalı, yoksa bir sonraki dokunuş
     "ikinci dokunuş" sanılıp doğrudan gidiyor */
  useEffect(() => { if (!hot) arm(false) }, [hot, arm])

  return [hot, bind, guard, armed]
}
