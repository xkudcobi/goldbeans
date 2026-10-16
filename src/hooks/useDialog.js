import { useEffect } from 'react'

/*
 * Açılır pencerelerin (saatler, şube galerisi) ortak davranışı:
 *
 *   - Esc her yerden kapatıyor — odak pencerenin içinde olmayabilir.
 *   - Arkadaki sayfa kaymıyor. Telefonda pencerenin üstünde parmakla
 *     kaydırınca altta sayfa kayıp pencere "yüzüyordu".
 *   - Odak pencereye geçiyor (Tab arkadaki sahneye düşmesin), kapanınca
 *     pencereyi açan öğeye geri dönüyor (klavyeyle gezen yerini kaybetmesin).
 *
 * `onClose` sabit kimlikte olmalı (useCallback / AppState eylemleri);
 * değişirse effect yeniden kurulup odak tekrar pencereye çekilir.
 */
export default function useDialog(open, onClose, ref) {
  useEffect(() => {
    if (!open) return

    const opener = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const root = document.documentElement
    const prevOverflow = root.style.overflow
    root.style.overflow = 'hidden'

    ref.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKey)
      root.style.overflow = prevOverflow
      /* preventScroll: açan öğe ekranın dışındaysa sayfa ona zıplamasın */
      opener?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, ref])
}
