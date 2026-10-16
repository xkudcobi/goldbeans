import { useCallback, useState } from 'react'
import cafe, { branchMapUrl, branchPhone, branchPhotos, telHref } from '../config/cafe.js'
import BranchDialog from './BranchDialog.jsx'
import { CameraIcon } from './icons.jsx'
import NoPhotos from './NoPhotos.jsx'

/*
 * Kapıdan girilince gelinen ekran — şubeler. İçerik cafe.js → locations.
 *
 * Her şube bir kart: kartın TAMAMI dokunulabilir ve şubenin fotoğraf
 * galerisini açıyor (BranchDialog). Kart içindeki telefon ve harita
 * linkleri kendi işlerini yapmaya devam ediyor — "gerilmiş düğme" kalıbı:
 * düğmenin ::after'ı kartın tamamını kaplıyor, linkler onun üstünde duruyor
 * (app.css → .branch). Böylece iç içe tıklanabilir öğe olmadan tüm kart
 * tek bir dokunma hedefi oluyor.
 */

export default function LocationsSection() {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  return (
    <section className="locations" id="lokasyonlar">
      <header className="section-head">
        <p className="section-head__kicker">ŞUBELER</p>
        <h2 className="section-head__title">Nerelerdeyiz</h2>
      </header>

      <ul className="locations__list">
        {cafe.locations.map((loc, i) => {
          const mapUrl = branchMapUrl(loc)
          const phone = branchPhone(loc)
          const photos = branchPhotos(loc)

          return (
            <li className="branch" key={loc.name} style={{ '--i': i }}>
              <div className="branch__cover" aria-hidden="true">
                {photos.length ? (
                  <>
                    <img src={photos[0]} alt="" loading="lazy" decoding="async" />
                    <span className="branch__count">
                      <CameraIcon />
                      {photos.length}
                    </span>
                  </>
                ) : (
                  <span className="branch__placeholder">
                    <NoPhotos branch={loc} />
                  </span>
                )}
              </div>

              <div className="branch__body">
                <h3 className="branch__name">
                  <button
                    type="button"
                    className="branch__open"
                    onClick={() => setOpen(loc)}
                    aria-haspopup="dialog"
                  >
                    {loc.name}
                  </button>
                  {loc.soon && <span className="locations__soon">yakında</span>}
                </h3>
                <address className="branch__address">
                  {loc.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>

                <div className="branch__foot">
                  <span className="branch__cta" aria-hidden="true">
                    {photos.length ? 'Fotoğrafları gör' : 'Şubeyi gör'} →
                  </span>
                  <span className="branch__links">
                    {phone && (
                      <a className="branch__link" href={telHref(phone)} aria-label={`${loc.name} — ara`}>
                        Ara
                      </a>
                    )}
                    {/* adresi olmayan şubede (İstanbul) link basmıyoruz */}
                    {mapUrl && (
                      <a
                        className="branch__link"
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${loc.name} — haritada aç`}
                      >
                        Harita
                      </a>
                    )}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {open && <BranchDialog branch={open} onClose={close} />}
    </section>
  )
}
