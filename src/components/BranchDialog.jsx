import { useCallback, useRef, useState } from 'react'
import { branchMapUrl, branchPhone, branchPhotos, telHref } from '../config/cafe.js'
import useDialog from '../hooks/useDialog.js'
import NoPhotos from './NoPhotos.jsx'

/*
 * Şube kartına dokununca açılan pencere: fotoğraf galerisi + adres,
 * telefon, harita.
 *
 * Galeri yerel kaydırma ile çalışıyor (scroll-snap): telefonda parmakla
 * kaydırmak, masaüstünde oklar ve klavye (← →). Kaydırmayı kendimiz
 * canlandırmıyoruz — dokunmatikte tarayıcının kendi fiziği hem daha
 * akıcı hem de alışılmış olan.
 *
 * Fotoğraflar cafe.js → locations[].photos.
 */

export default function BranchDialog({ branch, onClose }) {
  const cardRef = useRef(null)
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)

  useDialog(true, onClose, cardRef)

  const photos = branchPhotos(branch)
  const mapUrl = branchMapUrl(branch)
  const phone = branchPhone(branch)
  const titleId = 'branch-dialog-title'

  /* Kaydırma konumundan hangi fotoğrafta olduğumuzu çıkarıyoruz */
  const onScroll = () => {
    const el = trackRef.current
    if (!el || !el.clientWidth) return
    setIndex(Math.round(el.scrollLeft / el.clientWidth))
  }

  const goTo = useCallback(
    (i) => {
      const el = trackRef.current
      if (!el) return
      const next = Math.max(0, Math.min(i, photos.length - 1))
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
    },
    [photos.length],
  )

  const onKeyDown = (e) => {
    if (photos.length < 2) return
    if (e.key === 'ArrowRight') goTo(index + 1)
    else if (e.key === 'ArrowLeft') goTo(index - 1)
    else return
    e.preventDefault()
  }

  return (
    /* Zemin tıklaması kapatıyor; kartın içindeki tıklama zemine ulaşmasın */
    <div className="dialog-veil" onClick={onClose}>
      <div
        className="branch-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        ref={cardRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="branch-dialog__close"
          onClick={onClose}
          aria-label="Kapat"
        >
          ×
        </button>

        {photos.length ? (
          <div className="gallery">
            <div
              className="gallery__track"
              ref={trackRef}
              onScroll={onScroll}
              aria-label={`${branch.name} fotoğrafları`}
              role="region"
            >
              {photos.map((src, i) => (
                <img
                  key={src}
                  className="gallery__img"
                  src={src}
                  alt={`${branch.name} — fotoğraf ${i + 1} / ${photos.length}`}
                  /* ilki hemen, gerisi kaydırıldıkça */
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable="false"
                />
              ))}
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="gallery__nav gallery__nav--prev"
                  onClick={() => goTo(index - 1)}
                  disabled={index === 0}
                  aria-label="Önceki fotoğraf"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="gallery__nav gallery__nav--next"
                  onClick={() => goTo(index + 1)}
                  disabled={index === photos.length - 1}
                  aria-label="Sonraki fotoğraf"
                >
                  ›
                </button>
                <div className="gallery__dots">
                  {photos.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      className={`gallery__dot${i === index ? ' is-active' : ''}`}
                      onClick={() => goTo(i)}
                      aria-label={`Fotoğraf ${i + 1}`}
                      aria-current={i === index ? 'true' : undefined}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="gallery gallery--empty">
            <NoPhotos branch={branch} />
          </div>
        )}

        <div className="branch-dialog__body">
          <h2 className="branch-dialog__name" id={titleId}>
            {branch.name}
            {branch.soon && <span className="locations__soon">yakında</span>}
          </h2>
          <address className="branch-dialog__address">
            {branch.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>

          {(phone || mapUrl) && (
            <div className="branch-dialog__actions">
              {mapUrl && (
                <a
                  className="pill-btn pill-btn--solid"
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Haritada aç →
                </a>
              )}
              {phone && (
                <a className="pill-btn" href={telHref(phone)}>
                  Ara · {phone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
