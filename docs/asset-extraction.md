# Çizimler nereden geliyor

Tezgah sahnesindeki **hiçbir çizim elle yazılmadı**. Hepsi orijinal siteden
(<https://alt-portfolio.framer.website/>) çıkarıldı ve
`src/art/framerScene.js` içinde duruyor.

Bu dosya elle düzenlenmez — yeniden üretmek için aşağıdaki tarifi izle.

## Neden bu yol

Framer sahneyi tek bir SVG olarak yayınlamıyor. Öğeler üç ayrı biçimde
duruyor ve üçü de ayrı ayrı toplanmak zorunda:

| Biçim | Örnek | Nasıl alınır |
|---|---|---|
| `<img src="data:image/svg+xml,…">` | Tezgah, lekeler | `src` niteliği |
| CSS `background-image` data URI | **Fincanların tamamı**, lamba, radyo | `getComputedStyle().backgroundImage` |
| Inline `<svg><use href="#…"></svg>` | Raflar, makine, saat gövdesi | `outerHTML` + ayrıca sprite |

Son satır önemli: inline SVG'ler ortak bir sprite'a bakıyor. Sprite'ı
almazsan raflar, makine ve saat **boş** çıkar. `framerScene.js` içindeki
`DEFS` bu yüzden var ve sahnede bir kez gizli olarak basılıyor
(`.fdefs`, `display:none` OLMAZ — `<use>` çözülmez).

## Tarif

1. Siteyi Chrome'da aç, tezgah sahnesine kaydır. **Pencere görünür olmalı** —
   küçültülmüş sekmede `innerWidth` 0 döner, ölçüler bozulur.
2. Sahne kökü `.framer-e1ayky`. 13 doğrudan çocuğu = 13 öğe
   (`data-framer-name`: Counter, Manchas, Lamp, Mug 1-5, Shells, Radio,
   Clock, Machine, Plant).
3. Her öğeyi rekürsif serileştir: hesaplanmış stilleri `style` niteliğine
   inline'la (tırnakları `&quot;` yap, yoksa data URI'ler HTML'i kırar),
   `<svg>`'lere px cinsinden `width`/`height` ver.
4. Her serileştirmeden sonra işaretlemedeki `href="#…"` id'lerini
   `document.getElementById` ile topla → `DEFS`.
5. **Hover halleri gerçek fare ile alınmalı.** Framer'ın `framer-v-…`
   varyant sınıfını elle takmak yetmiyor: hover'da ayrıca üretilmiş bir
   sınıf ekleniyor (renk oradan geliyor) ve sprite'ın hover parçası ancak
   o an DOM'a giriyor. Öğenin üstüne gerçekten gel, ~900ms bekle, sonra
   hem işaretlemeyi hem yeni sprite id'lerini topla.
6. Çıkan JSON'u üretece ver. Son çıkarma `docs/scene-export.json` olarak
   duruyor — `framerScene.js`'i ondan yeniden üretebilirsin:

   ```bash
   node scripts/build-scene.mjs docs/scene-export.json
   ```

   Üreteç, sprite karşılığı eksik olan hover'ları **yazmaz** — yoksa o öğe
   hover'da görünmez oluyor. Framer CDN'indeki GIF de yerel kopyasına
   (`public/art/machine-hover.gif`) çevriliyor.

## Sahne yerleşimi

Koordinatlar 1099x545'lik sabit tuvale göre px. `CounterScene.jsx` tuvali
bir bütün olarak `scale()` ediyor (ResizeObserver ile). Tek tek öğeleri
yüzdeye çevirme — iç ölçüler px olduğu için çizimler dağılır.

İki sahne çıkarıldı:

| Sahne | Ham çıkarma | Üretilen |
|---|---|---|
| Tezgah (1099x545) | `docs/scene-export.json` | `src/art/framerScene.js` |
| Kapı odası (1122x599) | `docs/room-export.json` | `src/art/framerRoom.js` |

Oda sahnesi carousel'de ikinci slayt olduğu için ekran dışında duruyor.
Idle çıkarma orada da doğru (layout hesaplanıyor), ama **hover için sahnenin
görünür olması gerekiyor**. Ok tuşuna tıklamak yerine slayt raylarının
transform'unu geçici olarak elle kaydırmak daha güvenilir:

```js
document.querySelector('.framer-1ajt4tq').style.transform = 'matrix(1,0,0,1,<X>,0)'
```

## Tuzaklar

- **Font özelliklerini serileştirmeyi unutma.** İlk tezgah çıkarmasında
  `font-size`/`font-family`/`line-height`/`white-space` yoktu; saat ve
  balon yazıları sayfanın fontuna düşüp kutularından taştı. Çıkarma iki
  kez yapıldı, ikincisinde bunlar eklendi.
- **`<p>` etiketlerine margin sıfırla.** Çıkarılan işaretlemede `<p>` var;
  tarayıcının varsayılan `1em` margin'i satırları birbirinden ayırıyor
  (posterdeki üç satır bu yüzden dağılmıştı). `app.css` içinde
  `.fprop__art p { margin: 0 }`.

- **Statik parçalar hover'ı yutuyor.** Raf (Shells), tezgah ve lekeler
  fincanların kutusunu örtüyor. `.fprop--static { pointer-events: none }`
  olmazsa alt raftaki fincanlar hover almıyor.
- **Saatin hover'ı yakalanamıyor.** İşaretlemesi Default/Hover arasında
  isim dışında aynı — orijinaldeki efekt bir animasyon, tek karelik
  çıkarmaya düşmüyor.
- Pencere küçültülmüşken sekmede `innerWidth` 0 döner; ölçüler ve
  ekran koordinatları bozulur. Çıkarmayı görünür pencerede yap.
- **Kapının açık hâli çekilemiyor.** Kapıya tıklayınca sahne unmount olup
  yerine banyo sahnesi geliyor; açılış anını yakalamaya çalışmak hover
  hâlini veriyor. Bu yüzden açılış CSS'te kuruldu (`.fprop--door.is-open`).
- **ResizeObserver döngüsü.** Tuvalin scale'i yüksekliği, yükseklik
  scrollbar'ı, scrollbar da genişliği değiştiriyor. `Stage.jsx` içindeki
  0.002'lik eşiği kaldırma — sekme kilitleniyor.
