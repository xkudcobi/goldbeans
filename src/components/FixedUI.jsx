import Logo from './Logo.jsx'
import cafe from '../config/cafe.js'

/*
 * Sabit üst katman: tagline, logo, menü kısayolları.
 *
 * Sağ üstteki ses düğmesi KALDIRILDI — ortada çalacak bir parça yokken
 * duruyordu. Müzik şimdilik sadece radyodan açılıp kapanıyor
 * (CounterScene → Radio, durum state/AppState.jsx). Parça eklenince
 * düğmeyi geri koymak istersen: useApp()'ten playing/togglePlaying al,
 * .fixed-sound sınıfıyla bir <button> bas — CSS'i duruyor.
 */

export default function FixedUI() {
  return (
    <>
      {/* Kayan içerik sabit başlığın altından geçerken üst üste binmesin */}
      <div className="fixed-veil" aria-hidden="true" />

      <div className="fixed-tagline">{cafe.tagline}</div>

      <div className="fixed-logo">
        <Logo />
      </div>

      <nav className="fixed-nav" aria-label="Bölümler">
        <a href="#menu">Menü</a>
        <a href="#ziyaret">Ziyaret</a>
      </nav>
    </>
  )
}
