import { memo, useEffect, useRef, useState } from 'react'
import { useApp } from '../state/AppState.jsx'
import { HandIcon } from './icons.jsx'

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

function useStageScale(scene, fitHeight) {
  const ref = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
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
  }, [scene.w, scene.h, fitHeight])

  return [ref, scale]
}

/*
 * "Buradaki her şey tıklanıyor" ipucu.
 *
 * Mobil testlerde kullanıcıların çoğu sahnedeki çizimlerin dokunulabilir
 * olduğunu anlamadı — dokunmatikte imleç değişmiyor, hover yok. Sahne
 * ekrana girince tıklanabilir her öğenin üstünde soldan sağa sırayla bir
 * halka yayılıyor, öğe hafifçe zıplıyor, üstte "dokun, keşfet" yazıyor.
 *
 * - Açılış perdesi inmeden başlamıyor (perdenin arkasında oynasa boşa gider).
 * - Sahne ekrandan çıkınca duruyor, geri gelince devam ediyor.
 * - Kullanıcı sahnede herhangi bir yere dokunduğu an bir daha oynamıyor:
 *   amaç öğretmek, öğrenene ısrar etmek değil.
 * - Dokunulmazsa REPEAT_MS arayla en fazla MAX_RUNS kez tekrar.
 *
 * Animasyonun kendisi CSS'te (app.css → "Tıklanabilirlik ipucu").
 * HINT_MS oradaki süreyi kapsamalı: halka 2 × 1.1sn + son öğenin gecikmesi.
 */
const HINT_MS = 3800
const REPEAT_MS = 7000
const MAX_RUNS = 3
/* ipucunun gösterildiği öğeler: bir yere götüren ya da bir şey açan her şey */
const HINTABLE = '.fprop--clickable, .fprop--mug'

function useStageHint(ref) {
  const { ready } = useApp()
  const [visible, setVisible] = useState(false)
  const [learned, setLearned] = useState(false)
  const [hinting, setHinting] = useState(false)
  const runs = useRef(0)

  /* Dalga soldan sağa aksın: öğelere tuvaldeki yatay sıralarına göre numara */
  useEffect(() => {
    const items = [...ref.current.querySelectorAll(HINTABLE)]
    items.sort((a, b) => a.offsetLeft - b.offsetLeft)
    items.forEach((el, i) => el.style.setProperty('--hint-i', i))
  }, [ref])

  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {
      threshold: 0.35,
    })
    io.observe(el)
    /* sahneye dokunan, tıklanabildiğini öğrenmiştir */
    const learn = () => setLearned(true)
    el.addEventListener('pointerdown', learn)
    return () => {
      io.disconnect()
      el.removeEventListener('pointerdown', learn)
    }
  }, [ref])

  useEffect(() => {
    if (!ready || !visible || learned) return
    let timer = 0
    const run = () => {
      if (runs.current >= MAX_RUNS) return
      runs.current += 1
      setHinting(true)
      timer = setTimeout(() => {
        setHinting(false)
        timer = setTimeout(run, REPEAT_MS)
      }, HINT_MS)
    }
    /* ilk seferde perde kalkar kalkmaz değil, göz sahneye yerleşince */
    timer = setTimeout(run, runs.current ? REPEAT_MS / 2 : 450)
    return () => {
      clearTimeout(timer)
      setHinting(false)
    }
  }, [ready, visible, learned])

  return hinting
}

/*
 * Tuvalin kenarına yakın öğeleri işaretliyor (data-edge="left|right").
 *
 * Öğenin üstüne/altına çıkan etiketler (fiyat, telefon, "tekrar dokun")
 * öğeye ortalanıyor. Telefonda sağ kenardaki kahve makinesinin etiketi
 * bu yüzden ekrandan taşıp sayfayı yana kaydırıyordu. İşaretli öğelerde
 * etiket ortalanmak yerine içe doğru hizalanıyor (app.css → [data-edge]).
 */
const EDGE = 0.2

function useEdgeMarks(ref, sceneW) {
  useEffect(() => {
    ref.current.querySelectorAll('.iprop').forEach((el) => {
      const center = (el.offsetLeft + el.offsetWidth / 2) / sceneW
      if (center < EDGE) el.dataset.edge = 'left'
      else if (center > 1 - EDGE) el.dataset.edge = 'right'
    })
  }, [ref, sceneW])
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


export default function Stage({ scene, defs, className = '', fit, label, children }) {
  const fitHeight = fit === 'height'
  const [stageRef, scale] = useStageScale(scene, fitHeight)
  const hinting = useStageHint(stageRef)
  useEdgeMarks(stageRef, scene.w)

  return (
    <div
      className={['stage', fitHeight && 'stage--fit', hinting && 'is-hinting', className]
        .filter(Boolean)
        .join(' ')}
      ref={stageRef}
      role="group"
      aria-label={label}
      /*
       * Tuvalin o anki ölçeği CSS'e de veriliyor.
       *
       * NEDEN: telefonda 1099px'lik tuval ~370px'e sığdırılıyor, yani her
       * şey 0.33 katına iniyor. Çizimin kendisi vektör, küçülmesi sorun
       * değil; ama fincanın fiyat etiketi gibi ÜSTÜNE BASTIĞIMIZ yazılar
       * da 12px'ten ~4px'e düşüp okunmaz oluyordu. app.css bu değeri
       * kullanıp o etiketleri (ve ipucu halkalarını) geri büyütüyor.
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

      {/* tıklanabilirlik ipucunun rozeti; yazı aygıta göre CSS'te seçiliyor */}
      <div className="stage__hint" aria-hidden="true">
        <HandIcon />
        <span className="stage__hint-touch">dokun, keşfet</span>
        <span className="stage__hint-mouse">tıkla, keşfet</span>
      </div>

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
