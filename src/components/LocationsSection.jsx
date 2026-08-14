import cafe from '../config/cafe.js'

/*
 * Kapıdan girilince açılan ekran — şubeler.
 *
 * TASARIM HENÜZ KONUŞULMADI. Şu an sitenin geri kalanıyla aynı dilde sade
 * bir liste; kapının bir yere çıkması için var. İçerik cafe.js → locations.
 */

export default function LocationsSection() {
  return (
    <section className="locations" id="lokasyonlar">
      <header className="section-head">
        <p className="section-head__kicker">
          <span className="pulser" aria-hidden="true" />
          ŞUBELER
        </p>
        <h2 className="section-head__title">Nerelerdeyiz</h2>
      </header>

      <ul className="locations__list">
        {cafe.locations.map((loc) => (
          <li className="locations__item" key={loc.name}>
            <h3 className="locations__name">{loc.name}</h3>
            <address className="locations__address">
              {loc.lines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <p className="locations__hours">{loc.hours}</p>
            <a
              className="locations__map"
              href={loc.mapUrl}
              target="_blank"
              rel="noreferrer"
            >
              Haritada aç →
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
