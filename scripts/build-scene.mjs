/*
 * Orijinal siteden çıkarılan sahne JSON'unu src/art/framerScene.js'e çevirir.
 *
 *   node scripts/build-scene.mjs <cikarilan.json> [cikti.js]
 *
 * JSON'un nasıl çıkarıldığı: docs/asset-extraction.md
 */
import fs from 'node:fs'

const IN = process.argv[2]
const OUT = process.argv[3] ?? 'src/art/framerScene.js'
if (!IN) {
  console.error('kullanım: node scripts/build-scene.mjs <cikarilan.json> [cikti.js]')
  process.exit(1)
}

const j = JSON.parse(fs.readFileSync(IN, 'utf8'))

/** Kökteki mutlak konumu söküyoruz — yerleşimi React sarmalayıcısı yapacak. */
function unroot(html) {
  const i = html.indexOf('style="')
  const end = html.indexOf('"', i + 7)
  const style = html.slice(i + 7, end)
  const kept = style
    .split(';')
    .filter(Boolean)
    .filter((d) => !/^(position|left|top|right|bottom|width|height)\s*:/.test(d))
    .join(';')
  return html.slice(0, i + 7) + 'position:relative;width:100%;height:100%;' + kept + html.slice(end)
}

const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/*
 * Framer CDN'inden gelen tek dosya: makine hover'ındaki GIF.
 * Yerel kopyası public/art/ içinde — uzak bağımlılık bırakmıyoruz.
 */
const VENDORED = [
  /*
   * __BASE__ yer tutucusu, çizim basılırken Vite'ın BASE_URL'iyle
   * doldurulur (Stage.jsx). Mutlak '/art/...' yazsaydık site bir alt
   * yolda yayınlandığında (GitHub Pages) GIF bulunamazdı.
   */
  [/https:\/\/framerusercontent\.com\/images\/edxDFo703ulLy[^"]*/g, '__BASE__art/machine-hover.gif'],
  /*
   * Orijinal sitenin sahibinin KİŞİSEL E-POSTASI telefonun balonunda
   * geçiyor. Render sırasında zaten değiştiriliyor ama ham hâli pakete
   * girmesin diye burada da yer tutucuya çevriliyor.
   * RoomScene.jsx bu yer tutucuyu cafe.contact.email ile dolduruyor.
   */
  [/[\w.+-]+@[\w-]+\.[\w.]+/g, 'E-POSTA-ADRESI'],
  /* aynı balonun diğer iki satırı da pakete girmesin */
  [/NOT EVEN AI CAN FIX IT,/g, ''],
  [/HERE IS MY EMAIL:/g, ''],
]
const vendor = (html) => VENDORED.reduce((s, [re, to]) => s.replace(re, to), html)

/*
 * Hover işaretlemesi <use href="#..."> ile sprite'a bakıyor; sprite parçasının
 * bir kısmı sadece hover anında DOM'a giriyor. Elimizde karşılığı yoksa çizim
 * bomboş çıkar — o yüzden eksik referanslı hover'ı hiç yazmıyoruz.
 */
const defIds = new Set([...j.defs.matchAll(/id="([^"]+)"/g)].map((m) => m[1]))
const resolvable = (html) =>
  [...html.matchAll(/href="#([^"]+)"/g)].every((m) => defIds.has(m[1]))

/*
 * Hover balonları (saatteki, makinedeki, lambadaki konuşma balonu) Framer'da
 * 0'dan 1'e fade ediyor. Çıkarma anını yakaladığımız için hepsi `opacity:0`
 * olarak geliyor ve balon hiç görünmüyor — sadece krem yazı kalıyor.
 *
 * Her etkileşimli öğede hot durumda TAM BİR TANE opacity:0 öğe var (ölçüldü)
 * ve o da balon. Bu yüzden hot'ta güvenle 1'e çekiliyor. idle'a DOKUNMA —
 * balonun orada gizli kalması gerekiyor.
 */
const showTooltip = (html) => html.replace(/opacity:0;/g, 'opacity:1;')

/* Aynı ada sahip iki öğe olabiliyor (oda sahnesinde iki "Chair") — id indeksli */
const props = j.props.map((p, i) => {
  return {
    name: p.name,
    id: `${slug(p.name)}-${i}`,
    x: p.x, y: p.y, w: p.w, h: p.h,
    idle: vendor(unroot(p.states.idle)),
    hot:
      p.states.hot && resolvable(p.states.hot)
        ? showTooltip(vendor(unroot(p.states.hot)))
        : null,
  }
})

const out = `/*
 * alt-portfolio.framer.website sahnesinden birebir çıkarılmış çizimler.
 * Elle yazılmadı — orijinal sitenin DOM'undan (SVG + CSS arka planları)
 * hesaplanmış stiller inline'lanarak alındı. Yeniden üretmek için
 * docs/asset-extraction.md içindeki tarife bak.
 *
 * Her prop: SCENE tuvaline göre koordinatlar + iki durum (idle / hot).
 */

export const SCENE = { w: ${j.sceneW}, h: ${j.sceneH} }

/*
 * Framer çizimleri <use href="#..."> ile ortak bir sprite'a bakıyor.
 * Sahnede bir kez, gizli olarak basılması gerekiyor — yoksa raflar,
 * makine ve saat gövdesi boş çıkar.
 */
export const DEFS = ${JSON.stringify(j.defs)}

export const PROPS = ${JSON.stringify(props, null, 2)}

export const byName = Object.fromEntries(PROPS.map((p) => [p.name, p]))
`

fs.writeFileSync(OUT, out)
console.log('yazıldı:', out.length, 'bayt')
