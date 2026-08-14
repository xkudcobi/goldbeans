# Etkileşim Haritası — ölçülen değerler

Tüm ölçümler `https://alt-portfolio.framer.website/` üzerinde 1920×951 viewport'ta,
`getComputedStyle` ve DOM örnekleme ile alındı.

---

## 1. Logo animasyonu (`Logo top`)

Sitedeki 6 raster PNG'nin tamamı **budur** — başka hiçbir yerde raster kullanılmıyor.

- 6 PNG, hepsi aynı konumda (`left: 832, top: 220`), 240×144 kutu, `object-fit: contain`
- Aynı anda yalnızca **bir** frame görünür; diğerleri `display:none`
- Ölçülen kare hızı: **~100ms/frame**, 6 frame → **~600ms döngü**, sonsuz loop
- Yani logo bir sprite/flipbook animasyonu, font veya SVG değil

Örneklenen görünürlük dizisi (100ms aralıkla):
```
100000 → 010000 → 001000 → 000100 → 000010 → 000001 → (başa dön)
```

**Replikada:** 6 kareli kendi çizimimizle aynı flipbook mantığı, `useState` + `setInterval(100)`.

---

## 2. Mug hover — replikanın çekirdeği

**Önemli:** Bu bir CSS transition **değil**. Ölçülen `transition-duration: 0s`.
Framer variant swap yapıyor — bu yüzden efekt "yumuşak geçiş" değil, **anlık snap**.

Mug yapısı: iki üst üste binmiş `<div>`, her biri `background-image` olarak SVG data-URI.

| Katman | Rest | Hover |
|---|---|---|
| Layer 0 (outline) | SVG-A | **farklı SVG'ye swap** (dolgulu varyant) |
| Layer 1 (detay) | SVG-B | **boşaltılıyor** (`none`) |
| transform (her ikisi) | `none` | `matrix(1.05155, 0, 0, 1.06349, -0.5, -1)` |

Yani hover'da üç şey aynı anda oluyor:
1. Outline katmanı pembe dolgulu varyantla değişiyor (pembe `#ff4a62` SVG'nin içinden geliyor,
   CSS `fill` değişmiyor)
2. Detay katmanı gizleniyor
3. Her iki katman **scale(1.0516, 1.0635)** + hafif yukarı kayma (-0.5px X, -1/-2px Y)

Scale X ve Y'nin farklı olması dikkat çekici — mug orantısız, hafif "şişiyor".

**Replikada:** iki varyantlı SVG (outline / dolgulu) + `transform: scale(1.0516, 1.0635)
translate(-0.5px, -1px)`, `transition: none`. Detay katmanı hover'da `opacity:0`.

---

## 3. Mug click

Her mug bir `<a href="./#project">` sarmalayıcısı içinde. Sayfada **4 adet** `#project`
anchor'ı var (görünen 5 mug'ın hepsi tıklanabilir değil).

---

## 4. Preloader

- Tam ekran `#511f20` maroon zemin, ortada `( … )` metni
- Süre: **~5 saniye**
- Çıkış animasyonu ölçülemedi (sekme araştırma sırasında kapandı) — replikada fade kullanıldı

---

## 5. Sahne / carousel

- `Slides` konteyneri altında tek doğrudan çocuk bulundu; sahneler muhtemelen runtime'da
  değiştiriliyor (DOM'da hepsi birden durmuyor)
- Görsel olarak **en az 2 sahne** teyit edildi:
  1. **Kafe tezgahı** — raf üstü 5 mug + Lamp, altta Radio / Clock / Machine / Plant, Counter, Manchas
  2. **Kapı / bekleme odası** — Poster ("choose your motivational quote here"), Chair, Pencils,
     Table, Window, Phone, Column, Smilely, Pestillo, Toilet, Fondo
- Kontrol çubuğu: `info` · `menu` · `prev` · `next` (alt orta, pill formunda, maroon zemin)

---

## 5b. Hover variant'ları — JS bundle'dan çıkarıldı

İlk tarama turumda bunları **kaçırmıştım**: DOM'da `cursor`/`link` kontrol etmiştim, Framer
variant'ları orada görünmüyor. Tanımlar `shared-lib` bundle'ının içinde duruyor.

| Öğe | Variant listesi | Boyut |
|---|---|---|
| **Machine** | `Default` · **`Hover`** · `mini` | 352×285 |
| **LAMP** | `Variant 1` · `Variant 2` | 98×127 |
| **Plant** | `Default` · **`Hover`** | 154×289 |
| **Radio** | `Default` · **`Hover`** | 107×78 |
| **Clock** | `Default` · **`Hover`** | 121×69 |
| **Pencils** | `Default` · **`Hover`** | 73×88 (2. sahne) |
| **Mug 1** | `Variant 1` · `Variant 2` · `mini 1` | 102×67 |
| **Mug 2** | `Variant 1` · `Variant 2` · `mini 2` | 112×52 |
| **Mug 3** | `Variant 1` · `Variant 2` · `mini 4` | 96×77 |
| **Mug 5** | `Variant 1` · `Variant 2` · `Variant PH` · `Variant 2 PH` | 89×74 |

**Yani tezgahtaki her öğe etkileşimli** — sadece mug'lar değil.

### Kahve damlaması bir GIF

Machine'in `Hover` variant'ı (`pVhEtWb2H`) SVG animasyonu çalıştırmıyor; arka plana bir GIF
biniyor:

- `edxDFo703ulLyoHy9S4qlcWFAs0.gif` — 500×500 kaynak, sahnede `sizes: 158px`, `fit: fill`
- Bundle'da ikinci bir GIF daha var: `yvGoHZJKfw0H8cyuFMKNjwJ65jI.gif` (480×480),
  `Slide 4` içindeki `a3ho3lWFI` variant'ında kullanılıyor

`loading` değeri scroll pozisyonuna bağlı hesaplanıyor — yani GIF sahne yaklaşınca yükleniyor,
hover'dan önce değil.

### Henüz bilinmeyen

Hangi öğenin hover'ında **görsel olarak ne** olduğu variant isimlerinden anlaşılmıyor.
`Machine → Hover = kahve damlıyor` GIF'ten teyitli. Lambanın ip çekme + yanma davranışı
kullanıcı tarifine dayanıyor, bundle'dan doğrulanmadı. Diğerleri (Plant/Radio/Clock) belirsiz.

---

## 6. Canlı saat

Clock illüstrasyonundaki rakamlar gerçek saat — gözlem sırasında `19:47` → `19:48` ilerledi.
Dakikada bir güncelleniyor.

---

## 7. Sabit UI

| Öğe | Konum | Davranış |
|---|---|---|
| `(a café-shaped portfolio)` | sol üst | statik |
| Logo | üst orta | 6 kareli flipbook (bkz. §1) |
| Ses toggle | sağ üst | ▶ / ⏸ arası durum değişiyor |
| Awwwards "Nominee" rozeti | sağ kenar, dikey | dış link |
| Kontrol çubuğu | alt orta | info / menu / prev / next |
