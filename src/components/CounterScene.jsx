import { useEffect, useState } from 'react'
import InteractiveProp from './InteractiveProp.jsx'
import Stage, { Art } from './Stage.jsx'
import boxStyle from './boxStyle.js'
import cafe from '../config/cafe.js'
import { useApp } from '../state/AppState.jsx'
import { SCENE, PROPS, DEFS } from '../art/framerScene.js'

/** Tezgahtaki saat gerçek saati gösteriyor */
function useClock() {
  const [t, setT] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`
}

const MUG_NAMES = ['Mug 1', 'Mug 2', 'Mug 3', 'Mug 4']
const STATIC = ['Counter', 'Manchas', 'Shells']

/** Etkileşimli dekorun ekran okuyucu adları */
const LABELS = {
  Plant: 'Bitki',
  Clock: 'Saat',
  Machine: 'Kahve makinesi',
  'Mug 5': 'Demlik',
}

/* Tıklanınca bir şey yapan iki öğe — orijinaldeki gibi */
const CLICK_LABELS = {
  Lamp: { on: 'Gündüz moduna dön', off: 'Sunset moduna geç' },
  Radio: { on: 'Müziği durdur', off: 'Müziği çal' },
}

/*
 * Hover balonlarının yazısı. Balon orijinal çizimin parçası — biz sadece
 * içindeki İngilizce metni değiştiriyoruz, metinler cafe.js → tips.
 */
const TIPS = {
  Lamp: [[/SUNSET MOOD/, cafe.tips.lamp]],
  Clock: [[/IT'S COFFEE O'CLOCK/, cafe.tips.clock]],
  Machine: [
    [/IS THERE SOMETHING BETTER/, cafe.tips.machine[0]],
    [/THAN THE SMELL OF GOOD COFFEE\?/, cafe.tips.machine[1]],
  ],
  'Mug 5': [
    [/THIS ONE GOT COLD\.\.\./, cafe.tips.kettle[0]],
    [/\s*TAKE ANOTHER ONE,/, cafe.tips.kettle[1]],
    [/GOES ON ME/, cafe.tips.kettle[2]],
  ],
  Radio: [
    [/A SONG TO SHAZAM AND\s*/, cafe.tips.radio[0]],
    [/NEVER LISTEN TO IT AGAIN/, cafe.tips.radio[1]],
  ],
}

function replacementsFor(name, time) {
  const tip = TIPS[name] ?? []
  /* saat gerçek saati gösteriyor */
  return name === 'Clock' ? [[/\d{2}:\d{2}/, time], ...tip] : tip
}

export default function CounterScene() {
  const time = useClock()
  const { sunset, toggleSunset, playing, togglePlaying } = useApp()

  const actions = {
    Lamp: { onClick: toggleSunset, active: sunset },
    Radio: { onClick: togglePlaying, active: playing },
  }

  return (
    <section className="scene scene--counter" id="tezgah">
      <Stage
        scene={SCENE}
        defs={DEFS}
        className="counter-stage"
        fit="height"
        header={
          <p className="scene__kicker">
            <span className="pulser" aria-hidden="true" />
            {cafe.counterKicker}
          </p>
        }
      >
        {/* sunset'te lambadan düşen ışık hüzmesi ve pencere ışığı */}
        <div className="sunlight" aria-hidden="true">
          <span className="sunlight__beam" />
          <span className="sunlight__pane sunlight__pane--a" />
          <span className="sunlight__pane sunlight__pane--b" />
        </div>

        {PROPS.map((p) => {
          /* tezgah, lekeler ve raflar — statik zemin */
          if (STATIC.includes(p.name)) {
            return (
              <div key={p.id} className="fprop fprop--static" style={boxStyle(p)}>
                <Art prop={p} />
              </div>
            )
          }

          /* fincanlar menüye götürüyor, etiketleri hover'da beliriyor */
          const mugIndex = MUG_NAMES.indexOf(p.name)
          if (mugIndex !== -1) {
            const drink = cafe.signatures[mugIndex]
            return (
              <InteractiveProp
                key={p.id}
                name={drink?.name ?? p.name}
                className="fprop fprop--mug"
                style={boxStyle(p)}
                href="#menu"
                scale={false}
              >
                <Art prop={p} />
                {drink && (
                  <span className="mug__label" aria-hidden="true">
                    <span className="mug__label-name">{drink.name}</span>
                    <span className="mug__label-note">{drink.note}</span>
                    <span className="mug__label-price">{drink.price}</span>
                  </span>
                )}
              </InteractiveProp>
            )
          }

          /* lamba ve radyo tıklanabilir; geri kalan dekor sadece hover */
          const action = actions[p.name]
          const label = action
            ? CLICK_LABELS[p.name][action.active ? 'on' : 'off']
            : (LABELS[p.name] ?? p.name)

          return (
            <InteractiveProp
              key={p.id}
              name={label}
              className={`fprop${action ? ' fprop--clickable' : ''}`}
              style={boxStyle(p)}
              scale={false}
              onClick={action?.onClick}
              pressed={action ? action.active : undefined}
            >
              <Art prop={p} replace={replacementsFor(p.name, time)} />
              {/*
               * Bitkinin balonu çizimde var ama içi boş geldi — yazıyı
               * balonun tam üstüne biz basıyoruz. Ölçüler çizimden:
               * balon prop içinde 33.7,-41.6 / 142x45.6.
               */}
              {p.name === 'Plant' && (
                <span className="plant__tip" aria-hidden="true">
                  {cafe.tips.plant}
                </span>
              )}
            </InteractiveProp>
          )
        })}
      </Stage>
    </section>
  )
}
