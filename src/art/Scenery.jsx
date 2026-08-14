/*
 * Bulut çizimi — açılıştaki ve alt bilgideki dekor.
 *
 * NOT: Tezgah sahnesinin çizimleri artık burada DEĞİL. Onlar orijinal
 * siteden çıkarıldı ve `src/art/framerScene.js` içinde duruyor; buradaki
 * elle yazılmış stand-in'ler silindi (bkz. docs/asset-extraction.md).
 */

export function Cloud({ variant = 0 }) {
  const shapes = [
    'M 4 30 Q 10 12 30 16 Q 38 2 56 12 Q 78 8 84 30 Z',
    'M 4 30 Q 14 10 34 18 Q 48 0 66 14 Q 86 12 92 30 Z',
    'M 6 30 Q 12 16 28 20 Q 40 6 54 18 Q 70 14 78 30 Z',
  ]
  return (
    <svg viewBox="0 0 96 34" className="art-cloud" aria-hidden="true">
      <path className="line-art" d={shapes[variant % shapes.length]} />
      <line className="line-art" x1="2" y1="31" x2="94" y2="31" />
    </svg>
  )
}
