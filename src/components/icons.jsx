/* Sitenin çizgi dilinde küçük ikonlar (tokens.css → .line-art) */

export const CameraIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      className="line-art"
      d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.5-2h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z"
    />
    <circle className="line-art" cx="12" cy="13" r="3.2" />
  </svg>
)

/*
 * Kum saati — henüz açılmamış, fotoğrafı olmayan şubede (İstanbul) kamera
 * yerine duruyor. Kum akıyor, alt hazne dolunca saat kendini ters
 * çeviriyor ve baştan başlıyor. Saat simetrik olduğu için döngünün başa
 * sarması görünmüyor: ters dönmüş "dolu alt" = baştaki "dolu üst".
 * Animasyon app.css → .hourglass
 */
export const Hourglass = () => (
  <svg className="hourglass" viewBox="0 0 48 64" aria-hidden="true">
    <g className="hourglass__body">
      <path className="hourglass__sand hourglass__sand--top" d="M15.5 13h17L24 29.5z" />
      <path className="hourglass__sand hourglass__sand--bottom" d="M14 58h20l-10-11z" />
      <line className="hourglass__stream" x1="24" y1="31" x2="24" y2="57" />
      <path
        className="line-art"
        d="M12 5c0 15 10 21 10 27s-10 12-10 27M36 5c0 15-10 21-10 27s10 12 10 27"
      />
      <path className="line-art" d="M8 4h32M8 60h32" />
    </g>
  </svg>
)

/** "dokun, keşfet" rozetindeki el */
export const HandIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      className="line-art"
      d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5a1.5 1.5 0 0 1 3 0V11m0-.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.6-2.2L4.5 15.9a1.6 1.6 0 0 1 2.3-2.2L9 15.5"
    />
  </svg>
)
