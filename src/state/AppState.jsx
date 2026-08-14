import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import cafe from '../config/cafe.js'

/*
 * Sitenin iki global durumu — ikisi de tezgahtaki bir öğeden tetikleniyor:
 *
 *   sunset  → lambaya tıklayınca. Sayfanın tamamı akşam paletine geçiyor.
 *   playing → radyoya (veya sağ üstteki düğmeye) tıklayınca.
 *
 * Prop olarak taşımak yerine context: tetikleyen öğe sahnenin derinlerinde
 * (CounterScene → InteractiveProp), dinleyen ise en üstte (App, FixedUI).
 */

const Ctx = createContext(null)

export function AppState({ children }) {
  const [sunset, setSunset] = useState(false)
  const [playing, setPlaying] = useState(false)

  /* Palet gövdeye yazılıyor ki menü/ziyaret/footer da modu görsün */
  useEffect(() => {
    document.body.classList.toggle('is-sunset', sunset)
    return () => document.body.classList.remove('is-sunset')
  }, [sunset])

  /*
   * Radyo. config/cafe.js → music.tracks sırayla çalıyor, sonuncu bitince
   * başa dönüyor. Liste boşsa düğme yine çalışıyor (ikon değişiyor),
   * sadece ses çıkmıyor.
   */
  const tracks = cafe.music?.tracks ?? []
  const [track, setTrack] = useState(0)
  const audioRef = useRef(null)

  /* Tek bir Audio nesnesi; parça bitince sıradakine geçiyor */
  useEffect(() => {
    if (!tracks.length) return
    const el = (audioRef.current = new Audio())
    el.volume = cafe.music.volume ?? 0.5
    const next = () => setTrack((i) => (i + 1) % tracks.length)
    el.addEventListener('ended', next)
    return () => {
      el.removeEventListener('ended', next)
      el.pause()
      audioRef.current = null
    }
  }, [])

  /*
   * Sıra değişince kaynağı yükle — çalıyorsak ara vermeden devam et.
   * Yol BASE_URL ile kuruluyor: site Pages'te kökte değil /goldbeans/
   * altında duruyor, mutlak '/music/...' orada kırılırdı (bkz. vite.config.js).
   * Dosya adlarında boşluk var, encodeURI şart.
   */
  useEffect(() => {
    const el = audioRef.current
    if (!el || !tracks.length) return
    el.src = encodeURI(import.meta.env.BASE_URL + tracks[track].src.replace(/^\//, ''))
    if (playing) el.play().catch(() => {})
  }, [track])

  /* Radyoya tıklama */
  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (playing) el.play().catch(() => {})
    else el.pause()
  }, [playing])

  /*
   * Radyo bir kez açıldıktan sonra alttaki çalar adası ekranda kalıyor —
   * duraklatınca kaybolsaydı tekrar başlatmak için radyoyu bulmak gerekirdi.
   */
  const [radioTouched, setRadioTouched] = useState(false)

  const value = useMemo(
    () => ({
      sunset,
      toggleSunset: () => setSunset((v) => !v),
      playing,
      togglePlaying: () => {
        setRadioTouched(true)
        setPlaying((v) => !v)
      },
      /* alttaki çalar adası için (components/NowPlaying.jsx) */
      radioTouched,
      tracks,
      track,
      /* parça değiştirmek çalma durumunu bozmuyor: duruyorsa duruyor kalıyor */
      nextTrack: () => tracks.length && setTrack((i) => (i + 1) % tracks.length),
      prevTrack: () =>
        tracks.length && setTrack((i) => (i - 1 + tracks.length) % tracks.length),
    }),
    [sunset, playing, radioTouched, track, tracks],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp, AppState içinde çağrılmalı')
  return v
}
