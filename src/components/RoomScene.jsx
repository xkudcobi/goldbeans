import InteractiveProp from './InteractiveProp.jsx'
import Stage, { Art } from './Stage.jsx'
import boxStyle from './boxStyle.js'
import scrollToId from './scrollToId.js'
import cafe, { telHref } from '../config/cafe.js'
import { SCENE, PROPS, DEFS } from '../art/framerRoom.js'

/*
 * Kapı odası — menünün altında, aşağı scroll ile geliniyor.
 * Çizimler orijinal siteden çıkarıldı (bkz. docs/asset-extraction.md).
 *
 * Kapı açılıp kapanma efektini zaten HOVER'da yapıyor (çizimin iki hâli de
 * orijinalden geldi). Tıklamaya ayrı bir animasyon eklenmiyor — tıklama
 * sadece şubeler ekranına götürüyor.
 */

/* Ekran okuyucu adları — çizimlerde metin yok */
const LABELS = {
  'chair-0': 'Zemin',
  'poster-1': 'Poster',
  'door-2': 'Kapı — şubelerimize git',
  'column-4': 'Sehpa',
  'chair-5': 'Sandalye',
  'mug-6': 'Kalemlik',
  'table-7': 'Masa',
}

/* Posterdeki üç satırlık yer tutucu — yerine kendi yazımızı basıyoruz */
const POSTER_PLACEHOLDER = /CHOOSE YOUR|MOTIVATIONAL|QUOTE HERE/g

/*
 * Konuşma balonları.
 *
 * Telefonunki orijinalde sitenin sahibinin kişisel e-postasını taşıyordu.
 * Üreteç adresi 'E-POSTA-ADRESI' yer tutucusuna çeviriyor (pakete girmesin
 * diye — scripts/build-scene.mjs), burada da balonun tamamını basmıyoruz:
 * telefonun hover çizimi hiç render edilmiyor, yerine numarayı gösteren
 * kendi etiketimiz çıkıyor. Balonu boşaltmak yetmezdi — içi boş bir
 * konuşma balonu olarak görünürdü.
 */
const TIPS = {
  'mug-6': [
    [/NOT TO BITE,/, cafe.tips.roomMug[0]],
    [/BUT TO WRITE/, cafe.tips.roomMug[1]],
  ],
}

/** Hover çizimi olmadan basmak için */
const withoutHot = (p) => ({ ...p, hot: null })

export default function RoomScene() {
  const enterDoor = () => scrollToId('lokasyonlar')

  return (
    <section className="scene scene--room" id="oda">
      <Stage
        scene={SCENE}
        defs={DEFS}
        className="room-stage"
        label="Oda"
      >
        {PROPS.map((p) => {
          if (p.id === 'door-2') {
            return (
              <InteractiveProp
                key={p.id}
                name={LABELS[p.id]}
                className="fprop fprop--door fprop--clickable"
                style={boxStyle(p)}
                scale={false}
                onClick={enterDoor}
              >
                {/* açılıp kapanma zaten hover'da; tıklama sadece götürüyor */}
                <Art prop={p} />
              </InteractiveProp>
            )
          }

          /* telefon: tıklayınca aramaya götürüyor */
          if (p.id === 'phone-3') {
            return (
              <InteractiveProp
                key={p.id}
                name={`Bizi ara — ${cafe.contact.phone}`}
                className="fprop fprop--phone fprop--clickable"
                style={boxStyle(p)}
                href={telHref(cafe.contact.phone)}
                scale={false}
              >
                <Art prop={withoutHot(p)} />
                <span className="phone__label" aria-hidden="true">
                  {cafe.contact.phone}
                </span>
              </InteractiveProp>
            )
          }

          /*
           * Poster: orijinalin yer tutucu yazısı silinip kendi yazımız
           * basılıyor. Tıklayınca Instagram'a çıkıyor.
           */
          if (p.id === 'poster-1') {
            return (
              <InteractiveProp
                key={p.id}
                name={`${cafe.posterText} — Instagram hesabımız`}
                className="fprop fprop--poster fprop--clickable"
                style={boxStyle(p)}
                scale={false}
                href={cafe.contact.instagramUrl}
                external
              >
                <Art prop={p} replace={[[POSTER_PLACEHOLDER, '']]} />
                <span className="poster__text">{cafe.posterText}</span>
              </InteractiveProp>
            )
          }

          /*
           * Kalemlik: öneri/şikayet formuna götürüyor — balonu da zaten
           * "ÖNERİLERİNİ DUYALIM" diyor (cafe.js → tips.roomMug).
           * Adres cafe.js'te boşsa link basılmıyor, dekor olarak kalıyor.
           */
          if (p.id === 'mug-6') {
            const form = cafe.suggestionFormUrl
            return (
              <InteractiveProp
                key={p.id}
                name={form ? 'Önerilerini duyalım — öneri ve şikayet formu' : LABELS[p.id]}
                className={`fprop${form ? ' fprop--clickable' : ''}`}
                style={boxStyle(p)}
                scale={false}
                href={form || undefined}
                external={Boolean(form)}
              >
                <Art prop={p} replace={TIPS['mug-6']} />
              </InteractiveProp>
            )
          }

          return (
            <div key={p.id} className="fprop fprop--static" style={boxStyle(p)}>
              <Art prop={p} />
            </div>
          )
        })}
      </Stage>
    </section>
  )
}
