import { useState } from 'react'
import { AppState } from './state/AppState.jsx'
import Preloader from './components/Preloader.jsx'
import FixedUI from './components/FixedUI.jsx'
import CounterScene from './components/CounterScene.jsx'
import RoomScene from './components/RoomScene.jsx'
import LocationsSection from './components/LocationsSection.jsx'
import MenuSection from './components/MenuSection.jsx'
import VisitSection from './components/VisitSection.jsx'
import Footer from './components/Footer.jsx'
import './styles/app.css'

/*
 * Sıra: tezgah (tam ekran) → menü → kapı odası → şubeler → ziyaret → alt bilgi.
 * Kapı, altındaki şubeler bölümüne götürüyor; ikisi bu yüzden yan yana.
 *
 * Sahneler arası geçiş yatay carousel değil, aşağı scroll.
 *
 * ÇIKARILAN AMA SİLİNMEYEN İKİ PARÇA (geri istenirse hazır duruyor):
 *   - components/CloudIntro.jsx  → üstteki bulutlu boşluk. Buraya
 *     <CounterScene/>'den önce <CloudIntro/> koymak yeterli.
 *   - components/SceneCarousel.jsx + ControlBar.jsx → sağa/sola kaydırmalı
 *     sahne geçişi. Geri almak için CounterScene+RoomScene yerine
 *     <SceneCarousel/> koy.
 * İkisinin CSS'i de app.css içinde duruyor (.intro*, .carousel*).
 */

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <AppState>
      <Preloader onDone={() => setReady(true)} />
      <FixedUI />
      <main className={`page${ready ? ' is-ready' : ''}`}>
        <CounterScene />
        <MenuSection />
        <RoomScene />
        <LocationsSection />
        <VisitSection />
        <Footer />
      </main>
    </AppState>
  )
}
