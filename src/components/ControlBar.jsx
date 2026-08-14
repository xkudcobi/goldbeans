/*
 * Alt orta kontrol çubuğu: info · menu · prev · next
 * Orijinalde pill formunda, maroon zemin, cream ikonlar.
 */

export default function ControlBar({ onPrev, onNext, onInfo, onMenu, index, total }) {
  return (
    <nav className="controlbar" aria-label="Sahne kontrolleri">
      <button className="controlbar__btn" onClick={onInfo} aria-label="Bilgi">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle className="line-art" cx="12" cy="12" r="9" />
          <line className="line-art" x1="12" y1="10.5" x2="12" y2="17" />
          <circle cx="12" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
        </svg>
      </button>

      <button className="controlbar__btn" onClick={onMenu} aria-label="Menü">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <line className="line-art" x1="5" y1="9.5" x2="19" y2="9.5" />
          <line className="line-art" x1="5" y1="14.5" x2="19" y2="14.5" />
        </svg>
      </button>

      <span className="controlbar__sep" aria-hidden="true" />

      <button
        className="controlbar__btn"
        onClick={onPrev}
        aria-label="Önceki sahne"
        disabled={index === 0}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="line-art" d="M 14.5 5 L 8.5 12 L 14.5 19" />
        </svg>
      </button>

      <button
        className="controlbar__btn"
        onClick={onNext}
        aria-label="Sonraki sahne"
        disabled={index === total - 1}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="line-art" d="M 9.5 5 L 15.5 12 L 9.5 19" />
        </svg>
      </button>
    </nav>
  )
}
