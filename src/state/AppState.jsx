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
   * Radyo. Parça henüz seçilmedi — config/cafe.js → music.src boş.
   * Boşken düğme yine çalışıyor (ikon değişiyor), sadece ses yok;
   * src'yi doldurunca bu blok kendiliğinden devreye giriyor.
   */
  const audioRef = useRef(null)
  useEffect(() => {
    const src = cafe.music?.src
    if (!src) return
    const el = audioRef.current ?? (audioRef.current = new Audio(src))
    el.loop = true
    el.volume = cafe.music.volume ?? 0.5
    if (playing) el.play().catch(() => {})
    else el.pause()
  }, [playing])

  const value = useMemo(
    () => ({
      sunset,
      toggleSunset: () => setSunset((v) => !v),
      playing,
      togglePlaying: () => setPlaying((v) => !v),
    }),
    [sunset, playing],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp, AppState içinde çağrılmalı')
  return v
}
