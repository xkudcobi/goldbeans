import cafe, { branchMapUrl, telHref } from '../config/cafe.js'

/*
 * Ziyaret bilgileri: çalışma saatleri + adres.
 * Buradaki adres merkez şube (listenin ilki); tüm şubeler için Şubeler
 * bölümüne bakılıyor.
 */

export default function VisitSection() {
  const main = cafe.locations[0]

  return (
    <section className="visit" id="ziyaret">
      <header className="section-head">
        <p className="section-head__kicker">ZİYARET</p>
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
            {main.lines.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </address>
          <a
            className="visit__link"
            href={branchMapUrl(main)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Haritada aç →
          </a>
        </div>

        <div className="visit__col">
          <h3 className="visit__label">İletişim</h3>
          <ul className="visit__contact">
            {cafe.contact.phones.map((p) => (
              <li key={p.number}>
                <a href={telHref(p.number)}>{p.number}</a>
                {/* tek numara varken şehir etiketi basılmıyor — ayırt edecek
                    ikinci hat yok, cafe.js'te label boş bırakılıyor */}
                {p.label && <span className="visit__phone-label">{p.label}</span>}
              </li>
            ))}
            <li><a href={`mailto:${cafe.contact.email}`}>{cafe.contact.email}</a></li>
            <li>
              <a href={cafe.contact.instagramUrl} target="_blank" rel="noopener noreferrer">
                {cafe.contact.instagram}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
