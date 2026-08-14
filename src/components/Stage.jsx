import { memo, useEffect, useRef, useState } from 'react'

/*
 * İki sahnenin de ortak iskeleti.
 *
 * Çizimler sabit bir tuvale göre px olarak konumlanmış (tezgah 1099x545,
 * oda 1122x599). Tuvali bir bütün olarak scale ediyoruz — tek tek öğeleri
 * yüzdeye çevirmek iç ölçüleri bozar.
 *
 * fit="height": tuval hem genişliğe hem de kalan yüksekliğe sığdırılıyor ve
 * dibe yaslanıyor. Tezgah sahnesi böyle — tezgahın tabanı ekranın altına
 * denk gelsin diye (tuvalin alt kenarı zaten tezgahın tabanı).
 */

function useStageScale(scene, fitHeight, headerRef) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width } = entry.contentRect
      /* başlık da tuvalin payından yiyor */
      const height = entry.contentRect.height - (headerRef.current?.offsetHeight ?? 0)
      let next = width / scene.w
      if (fitHeight && height > 0) {
        /* Yüksekliği doldurmak için 1'in üstüne çıkabiliyor — çizimler
           vektör, büyümesi sorun değil. Kısıt genişlik. */
        next = Math.min(next, height / scene.h)
      } else {
        next = Math.min(1, next)
      }
      /*
       * Eşik şart: scale yüksekliği belirliyor, yükseklik scrollbar'ı,
       * scrollbar da genişliği. Eşiksiz bırakırsan bu üçlü birbirini
       * tetikleyip ResizeObserver'ı sonsuz döngüye sokuyor, sekme kilitleniyor.
       */
      setScale((prev) => (Math.abs(next - prev) < 0.002 ? prev : next))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [scene.w, scene.h, fitHeight, headerRef])

  return [ref, scale]
}

/*
 * Orijinal siteden çıkarılan işaretlemeyi basar.
 *
 * İki hâl de aynı anda DOM'da duruyor, hangisinin görüneceğine CSS karar
 * veriyor (.is-hot). Hover'da innerHTML değiştirmek cazip ama iki şeyi
 * bozuyor:
 *   1) TIKLAMA DÜŞÜYOR. mousedown'ın indiği düğüm re-render'da yok oluyor,
 *      mouseup başka düğüme geliyor, tarayıcı click üretmiyor. Lambanın ve
 *      kapının tıklaması tam olarak bu yüzden çalışmıyordu.
 *   2) Her hover'da birkaç KB'lık, data URI dolu HTML yeniden parse ediliyor.
 *
 * Bu yüzden `hot` prop'u yok — sarmalayıcıdaki .is-hot yetiyor.
 */
/*
 * Çizimlerdeki varlık yolları __BASE__ ile başlıyor (bkz. build-scene.mjs).
 * Burada Vite'ın taban yoluna çevriliyor: dev'de '/', GitHub Pages'te
 * '/<repo>/'. Mutlak yol gömseydik alt yolda yayınlanınca kırılırdı.
 */
const BASE = import.meta.env.BASE_URL

export const Art = memo(function Art({ prop, replace }) {
  /* replace: [[regex, metin], ...] — çizimin içindeki yazıları değiştirmek için */
  const apply = (html) => {
    const withBase = html.replaceAll('__BASE__', BASE)
    return replace
      ? replace.reduce((s, [re, to]) => s.replace(re, to), withBase)
      : withBase
  }

  const idle = apply(prop.idle)
  const hot = prop.hot ? apply(prop.hot) : null

  return (
    <>
      {/*
       * --only: hover karşılığı olmayan çizim. Bu işaret olmazsa CSS,
       * hover'da idle katmanını gizleyip yerine hiçbir şey koymuyor ve
       * öğe kayboluyor (telefonda tam olarak bu oldu).
       */}
      <div
        className={`fprop__art ${hot ? 'fprop__art--idle' : 'fprop__art--only'}`}
        dangerouslySetInnerHTML={{ __html: idle }}
      />
      {hot && (
        <div
          className="fprop__art fprop__art--hot"
          dangerouslySetInnerHTML={{ __html: hot }}
        />
      )}
    </>
  )
})

export default function Stage({ scene, defs, className = '', fit, header, children }) {
  const fitHeight = fit === 'height'
  const headerRef = useRef(null)
  const [stageRef, scale] = useStageScale(scene, fitHeight, headerRef)

  return (
    <div
      className={`stage ${fitHeight ? 'stage--fit' : ''} ${className}`}
      ref={stageRef}
      /*
       * Tuvalin o anki ölçeği CSS'e de veriliyor.
       *
       * NEDEN: telefonda 1099px'lik tuval ~370px'e sığdırılıyor, yani her
       * şey 0.33 katına iniyor. Çizimin kendisi vektör, küçülmesi sorun
       * değil; ama fincanın fiyat etiketi gibi ÜSTÜNE BASTIĞIMIZ yazılar
       * da 12px'ten ~4px'e düşüp okunmaz oluyordu. app.css bu değeri
       * kullanıp o etiketleri geri büyütüyor ("Dar ekran" bölümü).
       *
       * Sadece DOM etiketleri için — çizimin İÇİNDEKİ balonlar (makine,
       * demlik, saat) küçülmeye devam ediyor, çünkü onlar çizimin parçası
       * ve büyütülürse balonun dışına taşarlar.
       */
      style={{ '--stage-scale': scale }}
    >
      {/* çizimlerin <use> ile baktığı sprite — görünmez, bir kez basılıyor */}
      <div
        className="fdefs"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: defs }}
      />

      {/*
       * Başlık, çizimin sol kenarıyla hizalı olsun diye tuvalin ölçeklenmiş
       * genişliğinde bir kutuya giriyor. Sayfanın soluna yaslarsan sahne
       * scale'lendikçe hizadan kayıyor.
       */}
      {header && (
        <div
          className="stage__header"
          ref={headerRef}
          style={{ width: `${scene.w * scale}px` }}
        >
          {header}
        </div>
      )}

      <div className="stage__box" style={{ height: `${scene.h * scale}px` }}>
        <div
          className="fstage"
          style={{
            width: `${scene.w}px`,
            height: `${scene.h}px`,
            marginLeft: `${-scene.w / 2}px`,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
