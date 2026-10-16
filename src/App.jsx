import { AppState, useApp } from './state/AppState.jsx'
import Preloader from './components/Preloader.jsx'
import FixedUI from './components/FixedUI.jsx'
import NowPlaying from './components/NowPlaying.jsx'
import HoursCard from './components/HoursCard.jsx'
import useSmoothAnchors from './hooks/useSmoothAnchors.js'
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
 */

function Page() {
  const { ready, markReady } = useApp()

  /* sayfa içi '#' bağlantıları ışınlamak yerine kayarak gitsin */
  useSmoothAnchors()

  return (
    <>
      <Preloader onDone={markReady} />
      <FixedUI />
      <main className={`page${ready ? ' is-ready' : ''}`}>
        <CounterScene />
        <MenuSection />
        <RoomScene />
        <LocationsSection />
        <VisitSection />
        <Footer />
      </main>
      {/* radyo açıldıktan sonra altta ortada duran çalar adası */}
      <NowPlaying />
      {/* tezgahtaki saate tıklayınca açılan saatler penceresi */}
      <HoursCard />
    </>
  )
}

export default function App() {
  return (
    <AppState>
      <Page />
    </AppState>
  )
}
