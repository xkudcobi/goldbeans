import { useEffect, useState } from 'react'
import cafe from '../config/cafe.js'

/*
 * Flipbook logo — ölçülen mekanik: 6 kare, ~100ms/kare, sonsuz döngü.
 * (Orijinalde bu 6 adet PNG ile yapılıyor; sitedeki TEK raster kullanımı bu.)
 * Buradaki kareler kendi çizimimiz: her karede harfler hafifçe oynuyor.
 */

const FRAME_MS = 240
const FRAMES = 6

/*
 * Her kare için [harf kayması, ölçek, rotasyon].
 * Kasıtlı olarak küçük tutuldu — daha büyük değerlerde logo "zıplıyor"
 * gibi duruyor. Hızı da FRAME_MS ile ayarla.
 */
const JITTER = [
  [0, 1, 0],
  [-0.15, 1.005, -0.4],
  [0.15, 0.997, 0.3],
  [-0.1, 1.008, 0.5],
  [0.12, 1, -0.3],
  [-0.18, 1.003, 0.4],
]

export default function Logo() {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    /* hareket azaltmayı seçen kullanıcıda logo sabit dursun */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES), FRAME_MS)
    return () => clearInterval(id)
  }, [])

  const letters = [...cafe.name]
  // viewBox harf sayısına göre büyüsün ki kafe adı değişince taşmasın
  const STEP = 26
  const PAD = 12
  const width = PAD * 2 + Math.max(letters.length - 1, 0) * STEP + 18

  return (
    <svg
      viewBox={`0 0 ${width} 44`}
      className="logo"
      role="img"
      aria-label={cafe.name}
    >
      {letters.map((ch, i) => {
        const [dx, s, r] = JITTER[(frame + i) % FRAMES]
        const x = PAD + i * STEP
        return (
          <text
            key={i}
            x={x + dx}
            y="32"
            fontFamily="var(--mono)"
            fontSize="30"
            fontWeight="700"
            fill="var(--ink)"
            transform={`rotate(${r} ${x} 24) scale(${s} ${2 - s})`}
            transformOrigin={`${x}px 24px`}
          >
            {ch}
          </text>
        )
      })}
    </svg>
  )
}
