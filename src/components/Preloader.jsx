import { useEffect, useMemo, useRef, useState } from 'react'
import cafe from '../config/cafe.js'

/*
 * Açılış perdesi: tam ekran maroon zemin, ortada daktilo gibi harf harf
 * yazılan karşılama satırları — "(selam)", "(yükleniyor...)" gibi.
 * Parantezler metnin parçası (cafe.js → loadingLines).
 *
 * İki tuzağa dikkat:
 *
 * 1) ZAMANA DAYALI olmalı, tick'e değil. Zincirleme setTimeout ile
 *    yazdırmayı denedik: perdenin altında iki sahnenin ilk çizimi sürerken
 *    ana iş parçacığı doluyor, 16ms'lik timer'lar 400ms'ye sarkıyor ve yazı
 *    sürünüyordu. Şimdi geçen SÜREYE bakıp metni oradan türetiyoruz.
 *
 * 2) requestAnimationFrame KULLANMA. Sekme arka plandayken (kullanıcı
 *    siteyi yeni sekmede açtıysa, pencere küçültülmüşse) rAF hiç çalışmıyor
 *    ve perde sonsuza kadar açık kalıyor — ölçüldü. setInterval arka planda
 *    da tikliyor; zamana dayalı olduğu için kısılması da sorun değil.
 *
 * Toplam süre satır sayısına ve aşağıdaki üç sabite bağlı (şu an ~4sn).
 * Kısaltmak için önce satır çıkar, sonra HOLD_MS'i düşür.
 */

const TYPE_MS = 40 // harf başına yazma
const HOLD_MS = 380 // satır tamamlanınca bekleme
const ERASE_MS = 16 // harf başına silme
const FADE_MS = 500

/** Satırları tek bir zaman çizelgesine çeviriyor */
function buildTimeline(lines) {
  const segs = []
  let t = 0
  lines.forEach((line, i) => {
    const last = i === lines.length - 1
    segs.push({ line, kind: 'type', start: t, dur: line.length * TYPE_MS })
    t += line.length * TYPE_MS
    segs.push({ line, kind: 'hold', start: t, dur: HOLD_MS })
    t += HOLD_MS
    if (!last) {
      segs.push({ line, kind: 'erase', start: t, dur: line.length * ERASE_MS })
      t += line.length * ERASE_MS
    }
  })
  return { segs, total: t }
}

function textAt(segs, ms) {
  for (const s of segs) {
    if (ms >= s.start + s.dur) continue
    const p = s.dur ? (ms - s.start) / s.dur : 1
    if (s.kind === 'type') return s.line.slice(0, Math.ceil(p * s.line.length))
    if (s.kind === 'hold') return s.line
    return s.line.slice(0, Math.floor((1 - p) * s.line.length))
  }
  return segs.length ? segs[segs.length - 1].line : ''
}

export default function Preloader({ onDone }) {
  const { segs, total } = useMemo(
    () => buildTimeline(cafe.loadingLines),
    [],
  )
  const [text, setText] = useState('')
  const [fading, setFading] = useState(false)
  const [gone, setGone] = useState(false)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const start = performance.now()
    let fadeTimer = 0

    const tick = () => {
      const ms = performance.now() - start
      setText(textAt(segs, ms))
      if (ms < total) return
      clearInterval(id)
      setFading(true)
      fadeTimer = setTimeout(() => {
        setGone(true)
        doneRef.current?.()
      }, FADE_MS)
    }

    const id = setInterval(tick, 50)
    return () => {
      clearInterval(id)
      clearTimeout(fadeTimer)
    }
  }, [segs, total])

  if (gone) return null

  return (
    <div
      className={`preloader${fading ? ' is-fading' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="preloader__line">
        {text}
        <span className="preloader__caret" aria-hidden="true" />
      </span>
    </div>
  )
}
