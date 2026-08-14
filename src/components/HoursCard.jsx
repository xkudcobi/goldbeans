import { useEffect, useRef } from 'react'
import cafe from '../config/cafe.js'
import { useApp } from '../state/AppState.jsx'

/*
 * Tezgahtaki saate tıklayınca açılan küçük pencere — çalışma saatleri.
 *
 * Eskiden saat sayfanın en altındaki Ziyaret bölümüne atıyordu; sadece
 * saatlere bakmak için sahneyi terk etmek gerekiyordu. Artık sahnede
 * kalınıyor. İçerik cafe.js → hours, Ziyaret bölümüyle aynı kaynak.
 *
 * Kapanma yolları: çarpı, dışına tıklama, Esc.
 */

export default function HoursCard() {
  const { hoursOpen, closeHours } = useApp()
  const cardRef = useRef(null)

  /*
   * Esc her yerden kapatsın — pencerenin içine odaklanılmamış olabilir.
   * Dinleyici sadece pencere açıkken bağlı.
   */
  useEffect(() => {
    if (!hoursOpen) return
    const onKey = (e) => e.key === 'Escape' && closeHours()
    document.addEventListener('keydown', onKey)
    /*
     * Odak pencereye geçsin: Tab ile gezinen kullanıcı arkadaki sahnenin
     * ortasında kalmasın, ilk Tab kartın içine düşsün. Odak çarpıya değil
     * kartın kendisine veriliyor — çarpının odak halkası kutunun köşesinden
     * taşıp göze batıyordu.
     */
    cardRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [hoursOpen, closeHours])

  if (!hoursOpen) return null

  return (
    /* Zemin tıklaması kapatıyor; kartın içindeki tıklama zemine ulaşmasın */
    <div className="hours-veil" onClick={closeHours}>
      <div
        className="hours-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hours-card-title"
        onClick={(e) => e.stopPropagation()}
        ref={cardRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="hours-card__close"
          onClick={closeHours}
          aria-label="Kapat"
        >
          ×
        </button>

        <p className="hours-card__kicker" id="hours-card-title">
          <span className="pulser" aria-hidden="true" />
          AÇIK SAATLER
        </p>

        <ul className="hours-card__list">
          {cafe.hours.map((h) => (
            <li key={h.days}>
              <span>{h.days}</span>
              <span className="hours-card__dots" aria-hidden="true" />
              <span className="hours-card__time">{h.time}</span>
            </li>
          ))}
        </ul>

        {/* adres ve iletişim aşağıda; bağlantı yumuşak kayıyor
            (hooks/useSmoothAnchors.js) ve pencereyi kapatıyor */}
        <a className="hours-card__link" href="#ziyaret" onClick={closeHours}>
          Adres ve iletişim →
        </a>
      </div>
    </div>
  )
}
