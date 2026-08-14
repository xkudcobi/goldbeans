import { useState } from 'react'
import CounterScene from './CounterScene.jsx'
import RoomScene from './RoomScene.jsx'
import ControlBar from './ControlBar.jsx'

/*
 * Sahne indeksi state'i + prev/next geçişi.
 * Yeni sahne eklemek için diziye bir bileşen daha koymak yeterli.
 */

const SCENES = [CounterScene, RoomScene]

export default function SceneCarousel() {
  const [index, setIndex] = useState(0)
  const [info, setInfo] = useState(false)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(SCENES.length - 1, i + 1))

  return (
    <section className="carousel" id="tezgah">
      <div
        className="carousel__track"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {SCENES.map((Scene, i) => (
          <div className="carousel__slide" key={i} aria-hidden={i !== index}>
            <Scene />
          </div>
        ))}
      </div>

      <ControlBar
        index={index}
        total={SCENES.length}
        onPrev={prev}
        onNext={next}
        onInfo={() => setInfo((v) => !v)}
        onMenu={() => setInfo(false)}
      />

      {info && (
        <div className="info-panel" role="dialog" aria-label="Bilgi">
          <button className="info-panel__close" onClick={() => setInfo(false)} aria-label="Kapat">
            ×
          </button>
          <p>
            Raftaki fincanların üstüne gel — imza içeceklerimiz. Tezgahtaki her şey
            (makine, lamba, radyo, saat, bitki) etkileşimli.
          </p>
          <p className="info-panel__meta">
            Sahne {index + 1} / {SCENES.length} · <a href="#menu">Tüm menü →</a>
          </p>
        </div>
      )}
    </section>
  )
}
