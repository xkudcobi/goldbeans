import { useApp } from '../state/AppState.jsx'

/*
 * Çalar adası — ekranın altında, ortada duran küçük yüzen kutu.
 *
 * Radyoya (CounterScene → Radio) ilk kez dokunulduğunda beliriyor ve
 * ondan sonra sayfada kalıyor: durdurunca kaybolsaydı müziği geri açmak
 * için tezgaha kadar scroll etmek gerekirdi.
 *
 * Ses ve parça sırası burada değil, state/AppState.jsx içinde — bu bileşen
 * sadece o durumu gösteriyor ve düğmeleri ona bağlıyor.
 * Parça listesi: config/cafe.js → music.tracks
 */

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    {children}
  </svg>
)

export default function NowPlaying() {
  const { radioTouched, playing, togglePlaying, tracks, track, nextTrack, prevTrack } = useApp()

  /* Radyoya hiç dokunulmadıysa ada yok; parça listesi boşsa da anlamsız */
  if (!radioTouched || !tracks.length) return null

  const title = tracks[track]?.title ?? ''

  return (
    <div className={`player${playing ? ' is-playing' : ''}`} aria-label="Radyo">
      {/* çalarken oynayan üç çubuk — durunca donuyor */}
      <span className="player__eq" aria-hidden="true">
        <i /><i /><i />
      </span>

      <span className="player__title" title={title}>{title}</span>

      <span className="player__btns">
        <button
          type="button"
          className="player__btn"
          onClick={prevTrack}
          aria-label="Önceki şarkı"
        >
          <Icon>
            <path className="line-art" d="M 15.5 6 L 9.5 12 L 15.5 18" />
            <line className="line-art" x1="7.5" y1="6" x2="7.5" y2="18" />
          </Icon>
        </button>

        <button
          type="button"
          className="player__btn player__btn--play"
          onClick={togglePlaying}
          aria-label={playing ? 'Şarkıyı durdur' : 'Şarkıyı çal'}
          aria-pressed={playing}
        >
          {playing ? (
            <Icon>
              <line className="line-art" x1="9.5" y1="6.5" x2="9.5" y2="17.5" />
              <line className="line-art" x1="14.5" y1="6.5" x2="14.5" y2="17.5" />
            </Icon>
          ) : (
            <Icon>
              <path className="line-art" d="M 9 6 L 18 12 L 9 18 Z" />
            </Icon>
          )}
        </button>

        <button
          type="button"
          className="player__btn"
          onClick={nextTrack}
          aria-label="Sonraki şarkı"
        >
          <Icon>
            <path className="line-art" d="M 8.5 6 L 14.5 12 L 8.5 18" />
            <line className="line-art" x1="16.5" y1="6" x2="16.5" y2="18" />
          </Icon>
        </button>
      </span>
    </div>
  )
}
