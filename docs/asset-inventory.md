# Sahne Envanteri — hangi öğe ne yapıyor

Tezgah sahnesindeki her çizim, ne işe yaradığı ve hover davranışı.
Çizimlerin tamamı `src/art/` altında; değiştirmek için sadece o klasörü düzenle.

---

## Tezgah sahnesi (`CounterScene.jsx`)

| Öğe | Rolü | Hover davranışı | Tıklama | Dosya |
|---|---|---|---|---|
| **Fincan ×4** | İmza içecekler | Gövde `--accent-soft` doluyor, buhar kayboluyor, `scale(1.052, 1.063)` + etiket beliriyor | `#menu`'ye gider | `art/Mug.jsx` |
| **Kahve makinesi** | Sahnenin sağ ağırlığı | Ekran `--accent`'e dönüyor, düğme yanıyor, portafiltreden damla düşüyor, fincan doluyor | — | `art/Scenery.jsx → Machine` |
| **Lamba** | Raf üstü aydınlatma | İp aşağı iniyor, kubbe+ampul yanıyor, ışık hüzmesi düşüyor | — | `→ Lamp` |
| **Radyo** | Tezgah dekoru | Makaralar dönüyor, antenden ses dalgaları | — | `→ Radio` |
| **Saat** | Canlı saat (gerçek saat, 15sn'de bir güncellenir) | Zil kapakları titriyor, ekran kırmızıya dönüyor | — | `→ Clock` |
| **Bitki** | Sol denge öğesi | Yapraklar salınıyor | — | `→ Plant` |
| **Raf ×2** | Fincanları taşır | Statik | — | `→ Shelf` |
| **Tezgah** | Zemin, ahşap çıta cephesi | Statik | — | `→ Counter` |
| **Lekeler** | Tezgah üstü gölge yığını | Statik | — | `→ Manchas` |

Fincan sayısı `config/cafe.js → signatures` dizisinin uzunluğuna bağlı (şu an 4,
her rafta 2). Daha fazla eklersen `CounterScene.jsx` içindeki raf yerleşimini
de genişletmen gerekir.

---

## Oturma alanı sahnesi (`RoomScene.jsx`)

| Öğe | Rolü | Durum |
|---|---|---|
| Poster | Günün çekirdeği duyurusu | Statik, metin bileşen içinde |
| Kapı + gülen yüz + sürgü | Sahne merkezi | Statik |
| Sandalye | Oturma alanı | Statik |
| Kalemlik + masa | Köşe detayı | Statik |

Bu sahne kasıtlı olarak sade — carousel'in çalıştığını göstermek için var.
Etkileşim eklemek istersen `InteractiveProp` ile sarmalaman yeterli:

```jsx
<InteractiveProp name="Sandalye" className="prop prop--chair">
  {(hot) => <Chair hot={hot} />}
</InteractiveProp>
```

---

## Sabit UI

| Öğe | Konum | Davranış |
|---|---|---|
| Tagline | sol üst | `config/cafe.js → tagline` |
| Logo | üst orta | 6 kareli flipbook, ~100ms/kare; harf sayısına göre otomatik boyutlanır |
| Menü / Ziyaret | sağ üst | Bölümlere anchor; hover'da alt çizgi |
| Ses toggle | sağ üst köşe | ▶ / ⏸ — **şu an sadece ikon değişiyor, ses dosyası bağlı değil** |
| Kontrol çubuğu | sahnenin altı | info · menü · ‹ · › |

---

## Animasyon notu

Hover state'leri `transition` **kullanmıyor** — anlık geçiş. Bu bilinçli bir
tercih: illüstrasyon diline yumuşak fade uymuyor, karakteri kayboluyor.

Süreli animasyonlar (damlama, salınım, dönme, alarm) CSS keyframes ile
`styles/app.css` içinde. Hepsi `prefers-reduced-motion: reduce` altında kapanıyor.

Ölçüm kaynaklı sayısal değerler (`--mug-hover-scale-*`) `styles/tokens.css` içinde.
