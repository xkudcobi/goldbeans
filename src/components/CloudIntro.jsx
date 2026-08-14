import { useEffect, useRef, useState } from 'react'
import { Cloud } from '../art/Scenery.jsx'

import cafe from '../config/cafe.js'

/*
 * Intro: cream zemin, yatay drift eden bulutlar, scroll ilerlemesine bağlı
 * olarak sırayla beliren metin satırları.
 * Metinler src/config/cafe.js → intro
 */

const LINES = cafe.intro

// [sol %, üst %, varyant, süre sn, ölçek]
const CLOUDS = [
  [6, 12, 0, 54, 1.1],
  [72, 8, 1, 68, 0.9],
  [22, 34, 2, 61, 0.7],
  [58, 46, 0, 75, 1.25],
  [12, 62, 1, 49, 0.85],
  [80, 66, 2, 82, 1.05],
  [40, 22, 1, 58, 0.6],
  [88, 38, 0, 71, 0.75],
]

export default function CloudIntro() {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      // 0 → bölümün başındayız, 1 → bölümün sonuna kadar kaydırdık
      const scrollable = Math.max(r.height - window.innerHeight, 1)
      const p = -r.top / scrollable
      setProgress(Math.min(Math.max(p, 0), 1))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section className="intro" ref={ref}>
      <div className="intro__clouds" aria-hidden="true">
        {CLOUDS.map(([left, top, v, dur, scale], i) => (
          <span
            key={i}
            className="intro__cloud"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              transform: `scale(${scale})`,
              animationDuration: `${dur}s`,
              animationDelay: `${-i * 7}s`,
            }}
          >
            <Cloud variant={v} />
          </span>
        ))}
      </div>

      <div className="intro__lines">
        {LINES.map((line, i) => {
          // her satır scroll ilerlemesinin kendi diliminde beliriyor
          const start = 0.12 + i * 0.22
          const o = Math.min(Math.max((progress - start) / 0.18, 0), 1)
          return (
            <p key={i} className="intro__line" style={{ opacity: o }}>
              {line}
            </p>
          )
        })}
      </div>
    </section>
  )
}
