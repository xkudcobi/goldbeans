import Logo from './Logo.jsx'
import cafe from '../config/cafe.js'

/*
 * Sabit üst katman: tagline, logo, bölüm kısayolları.
 * Müzik radyodan ve alttaki çalar adasından açılıp kapanıyor
 * (CounterScene → Radio, NowPlaying; durum state/AppState.jsx).
 */

export default function FixedUI() {
  return (
    <>
      {/* Kayan içerik sabit başlığın altından geçerken üst üste binmesin */}
      <div className="fixed-veil" aria-hidden="true" />

      <div className="fixed-tagline">{cafe.tagline}</div>

      {/* logo en başa, tezgaha döndürüyor */}
      <a className="fixed-logo" href="#tezgah" aria-label={`${cafe.name} — en başa dön`}>
        <Logo />
      </a>

      <nav className="fixed-nav" aria-label="Bölümler">
        <a href="#menu">Menü</a>
        <a href="#lokasyonlar">Şubeler</a>
        <a href="#ziyaret">Ziyaret</a>
      </nav>
    </>
  )
}
