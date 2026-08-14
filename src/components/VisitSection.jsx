import cafe from '../config/cafe.js'

/* Ziyaret bilgileri: çalışma saatleri + adres */

export default function VisitSection() {
  return (
    <section className="visit" id="ziyaret">
      <header className="section-head">
        <p className="section-head__kicker">
          <span className="pulser" aria-hidden="true" />
          ZİYARET
        </p>
        <h2 className="section-head__title">Uğra bir ara</h2>
      </header>

      <div className="visit__cols">
        <div className="visit__col">
          <h3 className="visit__label">Saatler</h3>
          <ul className="visit__hours">
            {cafe.hours.map((h) => (
              <li key={h.days}>
                <span>{h.days}</span>
                <span className="visit__dots" aria-hidden="true" />
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="visit__col">
          <h3 className="visit__label">Adres</h3>
          <address className="visit__address">
            {cafe.address.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <a
            className="visit__link"
            href={cafe.address.mapUrl}
            target="_blank"
            rel="noreferrer"
          >
            Haritada aç →
          </a>
        </div>

        <div className="visit__col">
          <h3 className="visit__label">İletişim</h3>
          <ul className="visit__contact">
            <li><a href={`tel:${cafe.contact.phone.replace(/\s/g, '')}`}>{cafe.contact.phone}</a></li>
            <li><a href={`mailto:${cafe.contact.email}`}>{cafe.contact.email}</a></li>
            <li>
              <a href={cafe.contact.instagramUrl} target="_blank" rel="noreferrer">
                {cafe.contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
